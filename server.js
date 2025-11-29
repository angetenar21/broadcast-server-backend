const websocket = require('ws');

function startServer(port) {
  const wss = new websocket.Server({ port: port });

  const clients = new Set();

  wss.on('listening', () => {
    console.log(`WebSocket server is listening on port ${port}`);
  });

  wss.on('connection', (ws) => {
    clients.add(ws);
    console.log('New client connected. Total clients:', clients.size);

    ws.on('message', (message) => {
      const text = message.toString();
      console.log('Received message:', text);

      // Broadcast the message to all connected clients
      for (const c of clients) {
        if (c.readyState === websocket.OPEN) {
          c.send(text);
        }
      }
    });

    // Handle client disconnection
    ws.on('close', () => {
      clients.delete(ws);
      console.log('Client disconnected. Total clients:', clients.size);
    });

    // Handle errors
    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  });

  // graceful shutdown handling for this server instance
  function shutdownInstance() {
    console.log('Shutting down WebSocket server...');
    // close all client connections
    for (const c of clients) {
      try {
        c.close();
      } catch (e) { }
    }
    // close the server
    wss.close(() => {
      console.log('WebSocket server closed.');
      process.exit(0);
    });
  }

  process.on('SIGINT', () => {
    shutdownInstance();
  });
}

// Note: shutdown is handled per-server instance inside `startServer`.

module.exports = startServer;



