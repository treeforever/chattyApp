const express = require('express');
const SocketServer = require('ws').Server;

// Set the port to 4000
const PORT = 4000;

// Create a new express server
const server = express()
   // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', (err, result) => {
    if (err) {
      console.log(err);
    }
    console.log(`Listening on ${ PORT }`)
  });

// Create the WebSockets server
// const wss = new SocketServer({ server });

const wss = new SocketServer({ server });
// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.

wss.broadcast = function broadcast(message) {
  wss.clients.forEach(function each(client) {
    client.send(message);
  });
};

wss.on('connection', (ws) => {
  console.log('Client connected');
  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  ws.on('message', function incoming(post) {
    if (JSON.parse(post).type === "message") {
      console.log('incoming message ', post)
    } else if (JSON.parse(post).type === "notification") {
      console.log('incoming notification ', post)
    } else {
      console.log('undefined post type')
    }

    wss.broadcast(post);

  });
  ws.on('close', () => console.log('Client disconnected'));
});
