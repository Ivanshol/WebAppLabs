const mongoose = require("mongoose");
const functions = require("firebase-functions");
const express = require("express");
const authRouter = require("./routers/authRouter");
const phonebookRouter = require("./routers/phonebookRouter");
const authMiddleware = require("./middleware/authMiddleware");

const app = require("./servers/expressServer");
const server = require("./servers/httpServer");
const io = require("./servers/socketServer");

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use("/auth", authRouter);
app.use("/phonebook", authMiddleware, phonebookRouter);

/*
const start = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://dmytro:dmytro123@cluster0.szepd.mongodb.net/wdt-lab1-phonebook?retryWrites=true&w=majority"
    );
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (e) {
    console.log("ERROR", e);
  }
};
*/

const clients = [];

await mongoose.connect(
  "mongodb+srv://dmytro:dmytro123@cluster0.szepd.mongodb.net/wdt-lab1-phonebook?retryWrites=true&w=majority"
);

/*server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});*/

const onConnection = socket => {
  console.log(`Client with id ${socket.id} connected`);
  clients.push(socket.id);

  socket.on("disconnect", () => {
    clients.splice(clients.indexOf(socket.id), 1);
    console.log(`Client with id ${socket.id} disconnected`);
  });
};

io.on("connection", onConnection);

//start();

exports.serverPhonebook = functions.https.onRequest(server);
