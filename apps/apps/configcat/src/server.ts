import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ConfigRowSimple } from './app/flags/model';
//import Papa from 'papaparse';
const Papa = require('papaparse');
const yaml = require('js-yaml');
const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');

const app = express();
// if this is not beeing set, when posting data the body is undefined
app.use(express.json());
const angularApp = new AngularNodeAppEngine();

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/**', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  })
);

// Add this section before the catch-all route
app.get('/api/example', (req, res) => {
  res.json({ message: 'Hello from SSR server!' });
});

app.post('/api/submit', (req, res) => {
  const data = req.body;
  if(data === undefined) {
    console.error('No data received', req.body);
  }
  console.log('Received data:', data);
  res.status(201).json({ status: 'success', data });
});

app.post('/api/upload/yaml', (req, res) => {
  try {
    const {service, tenant, fileContent, fileName } = req.body;

    if (!fileContent || !fileName) {
      return res.status(400).json({ error: 'Dateiinhalt und Dateiname sind erforderlich' });
    }

    // YAML zu JSON parsen
    //const yamlData = yaml.load(fileContent);

    // Konvertieren zu ConfigRowSimple[]
    const configRows: ConfigRowSimple[] = convertConfigToRows(fileContent, fileName);

    // Hier könnte bei Bedarf auch eine Speicherfunktion aufgerufen werden

    return res.status(200).json(configRows);
  } catch (error) {
    console.error('Fehler beim Verarbeiten der YAML-Datei:', error);
    return res.status(500).json({ error: 'Fehler beim Verarbeiten der YAML-Datei' });
  }
});

app.post('/api/upload/csv', (req, res) => {
  try {
    const {service, tenant, file, fileName } = req.body;

    if (!file || !fileName) {
      return res.status(400).json({ error: 'Dateiinhalt und Dateiname sind erforderlich' });
    }

    let parsedData:any = [];
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result:any) => {
        //this.parsedData.emit(result.data);
        parsedData = result.data;
       // console.log('Parsed CSV:', this.parsedData);
      },
      error: (err:any) => {
        alert('Error parsing CSV: ' + err.message);
      }
    });

    return res.status(200).json(parsedData);
  } catch (error) {
    console.error('Fehler beim Verarbeiten der YAML-Datei:', error);
    return res.status(500).json({ error: 'Fehler beim Verarbeiten der YAML-Datei' });
  }
});

/**
 * Converts Spring config file content (YAML or .properties) to ConfigRow[]
 * @param fileContent The content of the config file as string
 * @param fileName The name of the file (used to detect type)
 */
function convertConfigToRows(fileContent: string, fileName: string): ConfigRowSimple[] {
  if (fileName.endsWith('.yml') || fileName.endsWith('.yaml')) {
    // Parse YAML and flatten
    const yamlObj = yaml.load(fileContent) as any;
    return flattenYamlToRows(yamlObj);
  } else if (fileName.endsWith('.properties')) {
    return parsePropertiesToRows(fileContent);
  } else {
    throw new Error('Unsupported file type');
  }
}

// Helper to flatten nested YAML object to ConfigRow[]
function flattenYamlToRows(obj: any, prefix = ''): ConfigRowSimple[] {
  let rows: ConfigRowSimple[] = [];
  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      rows = rows.concat(flattenYamlToRows(obj[key], prefix ? `${prefix}.${key}` : key));
    } else {
      rows.push({ key: prefix ? `${prefix}.${key}` : key, value: String(obj[key]) });
    }
  }
  return rows;
}

// Helper to parse .properties file to ConfigRow[]
function parsePropertiesToRows(content: string): ConfigRowSimple[] {
  return content
    .split('\n')
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('#'))
    .map(line => {
      const idx = line.indexOf('=');
      if (idx === -1) return null;
      const key = line.substring(0, idx).trim();
      const value = line.substring(idx + 1).trim();
      return { key, value };
    })
    .filter((row): row is ConfigRowSimple => !!row);
}


/**
 * Handle all other requests by rendering the Angular application.
 */
app.use('/**', (req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next()
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
