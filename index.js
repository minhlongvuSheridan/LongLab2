const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const fs = require("fs");
var numPeople = 0; // counter number of people in the chat

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  // send store message to client
  socket.emit("StoredMessage", fs.readFileSync("chatStorage.txt", "utf-8"));
  io.emit(
    "msConnect",
    "A person just connected",
    ++numPeople + " people in the room"
  );

  // anounce when some one disconected
  socket.on("disconnect", () => {
    io.emit(
      "msDisconnect",
      "A person just disconected",
      --numPeople + " people in the room"
    );
  });

  socket.on("Message", (msg) => {
    io.emit("Message", msg);

    // store the message content to file
    fs.appendFile("chatStorage.txt", msg + "\n", function (err) {
      if (err) throw err;
    });
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
