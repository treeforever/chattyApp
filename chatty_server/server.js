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

let clientNum = 0;

wss.on('connection', (ws) => {
  clientNum += 1;
  console.log('Client connected. Client number is ', clientNum);
  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  ws.on('message', function incoming(message) {
    let newMsg = JSON.parse(message);
    newMsg.clientNum = clientNum;

    if (newMsg.type === "message") {
      console.log('incoming message ', newMsg)
    } else if (newMsg.type === "notification") {
      console.log('incoming notification ', newMsg)
    } else {
      console.log('undefined message type')
    }

    wss.broadcast(message);

  });
  ws.on('close', () => {
    clientNum -= 1;
    console.log('Client disconnected. Client number now is ', clientNum)
    wss.broadcast(JSON.stringify({
      type: 'notification',
      clientNum: `${clientNum}`
    }))
  });
});
