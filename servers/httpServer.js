const app = require("./expressServer");
const httpServer = require("http").createServer(app);

module.exports = httpServer;
