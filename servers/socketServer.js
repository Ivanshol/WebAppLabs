const { Server } = require("socket.io");
const httpServer = require("./httpServer");
const io = new Server(httpServer);

module.exports = io;
