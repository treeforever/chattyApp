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

uuidGenerator = () => {
  var d = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (d + Math.random()*16)%16 | 0;
      d = Math.floor(d/16);
      return (c=='x' ? r : (r&0x3|0x8)).toString(16);
  });
  return uuid;
}

assignColor = () => {
  let randomIndex = Math.floor(Math.random() * 4);
  let colors = ["#f48c42", "#42f45f", "#d942f4", "#42f4e5"]

  return colors[randomIndex];
}

function createCookie(name,value,days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        var expires = "; expires="+date.toGMTString();
    }
    else var expires = "";
    document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

let clientNum = 0;

wss.on('connection', (ws) => {
  //to show the number of online users
  clientNum += 1;

  let userColor = assignColor();
  ws.send(JSON.stringify({
    userColor: `${userColor}`
  }));
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

    wss.broadcast(JSON.stringify(newMsg));

  });
  ws.on('close', () => {
    clientNum -= 1;
    console.log('Client disconnected. Client number now is ', clientNum)
    wss.broadcast(JSON.stringify({
      type: 'notification',
      clientNum: `${clientNum}`,
      command: 'A user just left.'
    }))
  });
});
