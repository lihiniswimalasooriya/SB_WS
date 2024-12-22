const { WebSocketServer } = require("ws");
const express = require("express");
const http = require("http");

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const broadcast = (data, sender) => {
  wss.clients.forEach((client) => {
    if (client !== sender && client.readyState === client.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
};

wss.on("connection", (ws) => {
  console.log("New WebSocket connection");

  ws.on("message", (message) => {
    console.log("Received:", message.toString());

    ws.send(`Server received: ${message}`);

    broadcast({ message: message.toString() }, ws);
  });

  ws.on("close", () => {
    console.log("WebSocket connection closed");
  });
});

app.get("/", (req, res) => {
  res.send("WebSocket server is running.");
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`WebSocket server running on port ${PORT}`);
});

module.exports = { broadcast };
