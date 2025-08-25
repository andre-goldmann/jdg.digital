//export default import('../dist/apps/wellsync/server/server.mjs').then(module => module.app);

const server = require('../dist/apps/wellsync/server/main');

module.exports = server.app();
