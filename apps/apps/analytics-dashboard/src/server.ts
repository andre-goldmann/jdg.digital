import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { expressHandler } from '@genkit-ai/express';
import { analysisFlow, chatFlow } from './flows';
import { WhaleWisdomScraper } from './whale-wisdom-scraper';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');

const app = express();
app.use(express.json());
const angularApp = new AngularNodeAppEngine();

/**
 * Define an endpoint to call a flow.
 */
app.post('/chatFlow', expressHandler(chatFlow));
//app.post('/dataFlow', expressHandler(dataFlow));
app.post('/analysisFlow', expressHandler(analysisFlow));

/**
 * Endpoint for WhaleWisdom scraping
 */
app.post('/api/whale-wisdom', async (req, res) => {
  try {
    const { investor } = req.body;
    if (!investor) {
      return res.status(400).json({ error: 'Investor name is required' });
    }

    const scraper = new WhaleWisdomScraper();
    const data = await scraper.getFilerData(investor);

    return res.json(data);
  } catch (error) {
    console.error('WhaleWisdom API error:', error);
    return res.status(500).json({ error: 'Failed to fetch investor data' });
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
