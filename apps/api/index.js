//export default import('../dist/apps/wellsync/server/server.mjs').then(module => module.app);

//const server = require('../dist/apps/wellsync/server/server.mjs');

(async () => {
  const server = await import('../dist/apps/wellsync/server/server.mjs');
  module.exports = server.app();
})();


// Import required modules
//const path = require('path');

//const serverDistPath = path.join(process.cwd(), 'dist/wellsync/server/server.mjs');

//export default import(serverDistPath).then(module => module.app);
