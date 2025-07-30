import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promises as fs } from 'node:fs';
//import * as say from 'say';
import { v4 as uuidv4 } from 'uuid';

const say = require('say')

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

/**
 * Express Rest API endpoints defined here.
 */

// Parse JSON request bodies
app.use(express.json());

// Text-to-speech endpoint
app.post('/api/text-to-speech', async (req, res) => {
  try {
    const { text } = req.body;
    say.getInstalledVoices((err:any, voices:any) => {
      if (err) return console.error(err);
      console.log('Installed voices:', voices);
    });
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    // Generate unique filename
    const fileName = `${uuidv4()}.wav`;
    const filePath = join(serverDistFolder, 'temp', fileName);
    console.log('Path:', filePath);

    // Convert text to speech and save as wav file
    await new Promise<void>((resolve, reject) => {
      say.export(text, 'Microsoft Zira Desktop', 0.75, filePath, (err:any) => {
        if (err) {
          console.error('Error generating speech:', err);
          reject(err);
        } else {
          resolve();
        }
      });
    });

    // Send the file
    res.setHeader('Content-Type', 'audio/wav');
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);

    const fileStream = await fs.readFile(filePath);
    res.send(fileStream);
    console.log(`Sent audio file: ${fileName}`);
    // Clean up the file after sending
    fs.unlink(filePath).catch(console.error);
    return;
  } catch (error) {
    console.error('Text-to-speech error:', error);
    res.status(500).json({ error: 'Failed to process text-to-speech' });
    return;
  }
});

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
