import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ConfigFile, Flag, FlagDto } from './app/flags/model';
import configRouter from './api/config';
import settingsRouter from './api/settings';
const Papa = require('papaparse');
const yaml = require('js-yaml');
const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');
const fs = require('fs');
const path = require('path');
const app = express();
// if this is not beeing set, when posting data the body is undefined
app.use(express.json());
const angularApp = new AngularNodeAppEngine();

import postgres from 'postgres';

export const sql = postgres({
  host: 'localhost',
  port: 5432,
  database: 'chatdb',
  username: 'n8nchat',
  password: 'i5kEI1roe5L4',
});

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
app.post('/api/upload/yaml', async (req, res) => {
  try {
    const { env, service, tenant, fileContent, fileName } = req.body;

    if (!fileContent || !fileName) {
      return res
        .status(400)
        .json({ error: 'Dateiinhalt und Dateiname sind erforderlich' });
    }

    const uploadDir = path.join(
      serverDistFolder,
      'uploads',
      env,
      service,
      tenant
    );
    fs.mkdirSync(uploadDir, { recursive: true });
    fs.writeFileSync(path.join(uploadDir, fileName), fileContent);
    console.info('File stored to: ', path.join(uploadDir, fileName));

    await sql`
      insert into configuration_files (env, service, tenant, filename, path)
      values (${env}, ${service}, ${tenant}, ${fileName}, ${uploadDir})
    `;

    // Get the inserted configuration file from the database
    const configFileResult = await sql<ConfigFile[]>`
      SELECT *
      FROM configuration_files
      WHERE env = ${env}
        AND service = ${service}
        AND tenant = ${tenant}
        AND filename = ${fileName}
      ORDER BY id DESC LIMIT 1
    `;

    if (configFileResult.length === 0) {
      return res
        .status(500)
        .json({ error: 'Failed to retrieve configuration file record' });
    }

    const configFile = configFileResult[0];
    console.info('StoreConfig file: ', configFile);

    const flags: Flag[] = convertConfigToRows(configFile, fileContent);
    await sql`
      INSERT INTO flags ${sql(flags)}
    `;

    return res.status(200).json(flags);
  } catch (error) {
    console.error('Fehler beim Verarbeiten der YAML-Datei:', error);
    return res
      .status(500)
      .json({ error: 'Fehler beim Verarbeiten der YAML-Datei' });
  }
});

app.post('/api/upload/csv', async (req, res) => {
  try {
    const { env, service, tenant, fileContent, fileName } = req.body;

    if (!fileContent || !fileName) {
      return res
        .status(400)
        .json({ error: 'Dateiinhalt und Dateiname sind erforderlich' });
    }

    const configFile = await sql<ConfigFile[]>`
      SELECT *
      FROM configuration_files
      WHERE env = ${env}
        AND service = ${service}
        AND tenant = ${tenant}
      ORDER BY id DESC LIMIT 1
    `;

    if (configFile.length === 0) {
      return res
        .status(500)
        .json({ error: `Failed to retrieve configuration file record for env: ${env}, service: ${service}, tenant: ${tenant}` });
    }

    const uploadDir = path.join(serverDistFolder, 'uploads', service, tenant);
    fs.mkdirSync(uploadDir, { recursive: true });
    fs.writeFileSync(path.join(uploadDir, fileName), fileContent);
    console.info('File stored to: ', path.join(uploadDir, fileName));

    const csvFile = fs.readFileSync(path.join(uploadDir, fileName), 'utf8');

    Papa.parse(csvFile, {
      header: true,
      skipEmptyLines: true,
      complete: (result: any) => {
        result.data.forEach(async (row: any) => {
          //console.info('Row: ', row);
            try {
              const flagResult = await sql<Flag[]>`
              SELECT *
              FROM flags
              WHERE config_id = ${configFile[0].id}
                AND property = ${row.Property} LIMIT 1
            `;

              if(!flagResult || flagResult.length === 0) {
                console.error(`Flag not found for property: ${row.Property}`);
                return;
              }

              const updatedRow: FlagDto = {
                config: configFile[0],
                property: row.Property,
                value: flagResult[0].value,
                description: {
                  description: row.Description,
                  category: row.Category,
                  typerange: row['Type/Range'],
                  constraints: row['Relevant constraints or dependencies'],
                  remarks: row.Remarks
                }
              }
              await createOrUpdateDescription(flagResult, updatedRow);
            } catch (err: any) {
              console.error(err);
            }
        });
        //console.log('Parsed CSV and updated Configurations:', result.data);
      },
      error: (err: any) => {
        console.error('Error parsing CSV:', err.message);
      },
    });

    const results = await sql<Flag[]>`
      SELECT *
      FROM flags
    `;
    return res.status(200).json(results);
  } catch (error) {
    console.error('Fehler beim Verarbeiten der YAML-Datei:', error);
    return res
      .status(500)
      .json({ error: 'Fehler beim Verarbeiten der YAML-Datei' });
  }
});

app.get('/api/configurationfiles', async (req, res) => {
  console.info('loading configurationsfiles....');
  const results = await sql<ConfigFile[]>`
    SELECT *
    FROM configuration_files
  `;
  return res.status(200).json(results);
});

app.delete(
  '/api/configurations/delete/:env/:service/:tenant',
  async (req, res) => {
    try {
      const { env, service, tenant } = req.params;

      if (!env || !service || !tenant) {
        return res
          .status(400)
          .json({ error: 'Service, tenant, and fileName are required' });
      }

      const fileConfig = await sql<ConfigFile[]>`
        SELECT *
        FROM configuration_files
        WHERE service = ${service}
          AND tenant = ${tenant}
          AND env = ${env} LIMIT 1
      `;

      if (!fileConfig) {
        return res.status(404).json({ error: 'File configuration not found' });
      }

      const flags = await sql<Flag[]>`
      SELECT *
      FROM flags
        WHERE config_id = ${fileConfig[0].id}
    `;
      if (flags.length === 0) {
        return res.status(404).json({ error: 'No Flags found' });
      }

      // Delete all flags associated with this config file
      await sql`
        DELETE FROM flags
        WHERE config_id = ${fileConfig[0].id}
      `;

      // Delete the configuration file record
      await sql`
        DELETE FROM configuration_files
        WHERE id = ${fileConfig[0].id}
      `;

      // Return success response
      return res.status(200).json({
        message: `Configuration for ${env}/${service}/${tenant} successfully deleted`
      });

    } catch (error) {
      console.error('Error downloading file:', error);
      return res.status(500).json({ error: 'Error downloading file' });
    }
  }
);

app.get(
  '/api/configurations/download/:env/:service/:tenant',
  async (req, res) => {
    try {
      const { env, service, tenant } = req.params;

      if (!env || !service || !tenant) {
        return res
          .status(400)
          .json({ error: 'Service, tenant, and fileName are required' });
      }

      const fileConfig = await sql<ConfigFile[]>`
        SELECT *
        FROM configuration_files
        WHERE service = ${service}
          AND tenant = ${tenant}
          AND env = ${env} LIMIT 1
      `;

      if (!fileConfig) {
        return res.status(404).json({ error: 'File configuration not found' });
      }

      const flags = await sql<Flag[]>`
      SELECT *
      FROM flags
        WHERE config_id = ${fileConfig[0].id}
    `;
      if (flags.length === 0) {
        return res.status(404).json({ error: 'No Flags found' });
      }

      // Convert flags to YAML
      const yamlContent = convertFlagsToYaml(flags);

      // Set the response headers for file download
      res.setHeader('Content-Type', 'application/x-yaml');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${fileConfig[0].filename}"`
      );

      // Send the YAML content as a file download
      return res.send(yamlContent);

    } catch (error) {
      console.error('Error downloading file:', error);
      return res.status(500).json({ error: 'Error downloading file' });
    }
  }
);


app.get('/api/flags', async (req, res) => {
  const page = parseInt(req.query['page'] as string) || 0;
  const pageSize = parseInt(req.query['pageSize'] as string) || 15;
  const textFilter = (req.query['textFilter'] as string) || null;
  const serviceFilter = (req.query['serviceFilter'] as string) || null;
  const tenantFilter = (req.query['tenantFilter'] as string) || null;
  const envFilter = (req.query['envFilter'] as string) || null;
  const offset = page * pageSize;

  console.info(
    'loading flags: ',
    page,
    pageSize,
    offset,
    textFilter,
    serviceFilter,
    tenantFilter,
    envFilter
  );

  try {
    // Build WHERE clauses dynamically based on filters
    const whereConditions = [];
    const whereParams: any[] = [];

    if (serviceFilter) {
      whereConditions.push(`cf.service ILIKE $${whereParams.length + 1}`);
      whereParams.push(`%${serviceFilter}%`);
    }

    if (tenantFilter) {
      whereConditions.push(`cf.tenant ILIKE $${whereParams.length + 1}`);
      whereParams.push(`%${tenantFilter}%`);
    }

    if (envFilter) {
      whereConditions.push(`cf.env ILIKE $${whereParams.length + 1}`);
      whereParams.push(`%${envFilter}%`);
    }

    if (textFilter) {
      whereConditions.push(`f.property ILIKE $${whereParams.length + 1}`);
      whereParams.push(`%${textFilter}%`);
    }

    // Construct the WHERE clause
    const whereClause =
      whereConditions.length > 0
        ? `WHERE ${whereConditions.join(' AND ')}`
        : '';
    // Count query with filters
    const totalCountQuery = `
      SELECT COUNT(*) as count
      FROM flags f
        JOIN configuration_files cf
      ON f.config_id = cf.id
        ${whereClause}
    `;

    const [totalCount] = await sql.unsafe(totalCountQuery, whereParams);

    // Data query with filters, pagination and ordering
    const dataQuery = `
      SELECT f.*, fd.description, fd.category, fd.typerange, fd.constraints, fd.remarks,
             cf.service, cf.tenant, cf.env, cf.filename, cf.path
      FROM flags f
             JOIN configuration_files cf ON f.config_id = cf.id
             LEFT JOIN flag_descriptions fd ON f.description_id = fd.id
        ${whereClause}
      ORDER BY cf.service, cf.tenant
        LIMIT ${pageSize} OFFSET ${offset}
    `;
    //console.info('dataQuery: ', dataQuery, whereParams);
    const rawResults = await sql.unsafe(dataQuery, whereParams);
    //console.info('results: ', rawResults);
    const results = rawResults.map((row) => ({
      config: {
        id: row['config_id'],
        env: row['env'],
        service: row['service'],
        tenant: row['tenant'],
        filename: row['filename'],
        path: row['path'],
        stamp: row['stamp'],
      },
      property: row['property'],
      value: row['value'],
      description: row['description_id']
        ? {
            description: row['description'] || '',
            typerange: row['typerange'] || '',
            constraints: row['constraints'] || '',
            category: row['category'] || '',
            remarks: row['remarks'] || '',
          }
        : undefined,
    })) as FlagDto[];

    //description is null

    return res.status(200).json({
      items: results,
      total: totalCount['count'],
      page,
      pageSize,
    });
  } catch (error) {
    console.error('Error fetching flags:', error);
    return res.status(500).json({ error: 'Error fetching flags' });
  }
});

app.put('/api/flags', async (req, res) => {
  try {
    //const { env, service, tenant, property } = req.params;
    const updatedRow: FlagDto = req.body;

    console.info('Updating flag:', updatedRow);

    // Load the ConfigFile from database using config_id
    const configFileResult = await sql<ConfigFile[]>`
      SELECT *
      FROM configuration_files
      WHERE id = ${updatedRow.config.id} LIMIT 1
    `;
    const configFile = configFileResult[0];
    // Validate required fields
    if (!configFile.service || !configFile.tenant || !updatedRow.property) {
      return res
        .status(400)
        .json({ error: 'Missing required fields: service, tenant, property' });
    }
    // load the flag-entry of flags table, if the flag entry has a description_id, load the description and update it
    // if it does not have a description_id, create a new entry in the flag_descriptions table and update the flag with the new description_id
    // Load the flag entry from the database
    const flagResult = await sql<Flag[]>`
      SELECT *
      FROM flags
      WHERE config_id = ${updatedRow.config.id}
        AND property = ${updatedRow.property} LIMIT 1
    `;

    if (flagResult.length === 0) {
      return res.status(404).json({ error: 'Flag not found' });
    }

    await createOrUpdateDescription(flagResult, updatedRow);

    return res.status(200).json(updatedRow);
  } catch (error) {
    console.error('Error updating configuration:', error);
    return res.status(500).json({ error: 'Error updating configuration' });
  }
});

async function createOrUpdateDescription(
  flagResult: Flag[] &
    Iterable<NonNullable<Flag[][number]>> &
    postgres.ResultQueryMeta<Flag[]['length'], keyof Flag[][number]>,
  updatedRow: FlagDto
) {
  const flag = flagResult[0];
  let description_id = flag.description_id;
  //console.info(`Updating flag ${flag.property} with description ${updatedRow.description}`);
  // Check if there's an existing description to update or if we need to create a new one
  if (description_id) {
    // Update existing description
    await sql`
        UPDATE flag_descriptions
        SET description = ${updatedRow.description?.description || ''},
            typerange   = ${updatedRow.description?.typerange || ''},
            constraints = ${updatedRow.description?.constraints || ''},
            category    = ${updatedRow.description?.category || ''},
            remarks     = ${updatedRow.description?.remarks || ''}
        WHERE id = ${description_id}
      `;
  } else {
    // Create a new description entry
    const descriptionResult = await sql`
        INSERT INTO flag_descriptions (description, typerange, constraints, category, remarks)
        VALUES (${updatedRow.description?.description || ''},
                ${updatedRow.description?.typerange || ''},
                ${updatedRow.description?.constraints || ''},
                ${updatedRow.description?.category || ''},
                ${updatedRow.description?.remarks || ''}) RETURNING id
      `;

    description_id = descriptionResult[0]['id'];

    // Update the flag with the new description_id
    /**
     * Normally we would like this:
     * --config_id = ${updatedRow.config.id}
     * --AND property = ${updatedRow.property}
     * but as there are possible same entries for Prod/Env/Default we update all,
     * as we wanne have just one description per property
     */
    await sql`
        UPDATE flags
        SET description_id = ${description_id || null}
        WHERE
          -- updating all entries where the property is the same
          property = ${updatedRow.property}
      `;
  }
}

/**
 * Converts Spring config file content (YAML or .properties) to ConfigRow[]
 * @param fileContent The content of the config file as string
 * @param fileName The name of the file (used to detect type)
 */
/**
 * Converts a list of Flag objects back to YAML content
 * @param flags The array of Flag objects to convert
 * @returns A string containing the YAML representation
 */
function convertFlagsToYaml(flags: Flag[]): string {
  const yamlObj: Record<string, any> = {};

  for (const flag of flags) {
    const propertyPath = flag.property.split('.');
    let current: Record<string, any> = yamlObj;

    // Navigate through the property path to build nested structure
    for (let i = 0; i < propertyPath.length - 1; i++) {
      const key = propertyPath[i];
      if (!current[key]) {
        current[key] = {};
      }
      current = current[key] as Record<string, any>;
    }

    // Set the value for the leaf property
    const lastKey = propertyPath[propertyPath.length - 1];
    current[lastKey] = flag.value;
  }

  return yaml.dump(yamlObj, { lineWidth: 120 });
}

function convertConfigToRows(
  configFile: ConfigFile,
  fileContent: string
): Flag[] {
  if (
    configFile.filename.endsWith('.yml') ||
    configFile.filename.endsWith('.yaml')
  ) {
    // Parse YAML and flatten
    const yamlObj = yaml.load(fileContent) as any;
    return flattenYamlToRows(configFile, yamlObj);
  } else if (configFile.filename.endsWith('.properties')) {
    return parsePropertiesToRows(configFile, fileContent);
  } else {
    throw new Error('Unsupported file type');
  }
}

// Helper to flatten nested YAML object to ConfigRow[]
function flattenYamlToRows(
  configFile: ConfigFile,
  obj: any,
  prefix = ''
): Flag[] {
  let rows: Flag[] = [];
  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      rows = rows.concat(
        flattenYamlToRows(
          configFile,
          obj[key],
          prefix ? `${prefix}.${key}` : key
        )
      );
    } else {
      rows.push({
        config_id: configFile.id,
        property: prefix ? `${prefix}.${key}` : key,
        //value: String(obj[key]).startsWith('JWE')
        //  ? 'password'
         // : String(obj[key]),
        value: String(obj[key])
      });
    }
  }
  return rows;
}

// Helper to parse .properties file to ConfigRow[]
function parsePropertiesToRows(config: ConfigFile, content: string): Flag[] {
  return content
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
    .map((line) => {
      const idx = line.indexOf('=');
      if (idx === -1) return null;
      const property = line.substring(0, idx).trim();
      const value = line.substring(idx + 1).trim();
      const config_id = config.id;
      return { config_id, property, value };
    })
    .filter((row): row is Flag => !!row);
}

app.use('/api/config', configRouter);

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
