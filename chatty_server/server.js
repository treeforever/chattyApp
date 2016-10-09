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

//initial state
let clientNum = 0;
let onlineUsers = [];


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



pairColorAndId = () => {
  let pair = {};
  pair.userid = uuidGenerator();
  pair.color = assignColor();
  return pair;
}

updateOnlineUsers = (userid) => {
  onlineUsers.push({ userid: userid, username: "A user" });
  wss.broadcast(JSON.stringify({ onlineUsersUpdate: onlineUsers }));
}

updateUsername = (msg) => {
  if (msg.event === "namechange") {
    onlineUsers.map( (user) => {
      if (user.userid === msg.userid) {
        user.username = msg.newName
        wss.broadcast(JSON.stringify({ onlineUsersUpdate: onlineUsers }));
        console.log('someone changed changed', onlineUsers)
      }
    })
  }
}

confirmOnline = (msg) => {

  if (msg.event === "confirm online") {
    onlineUsers.push({
      userid: msg.userid,
      username: msg.useranme
    })
    wss.broadcast(JSON.stringify({ onlineUsersUpdate: onlineUsers }));
    console.log("someone left. now online users are: ", onlineUsers);
  }

}

wss.on('connection', (ws) => {
  //to show the number of online users
  clientNum += 1;

  let pair = pairColorAndId();
  ws.send(JSON.stringify(pair));
  updateOnlineUsers(pair.userid);

  ws.on('message', function incoming(message) {
    let newMsg = JSON.parse(message);
    newMsg.clientNum = clientNum;

    console.log('Incoming message', newMsg)

    updateUsername(newMsg);

    wss.broadcast(JSON.stringify(newMsg));

    confirmOnline(newMsg);
    console.log("Online users are:", onlineUsers)
  });

  ws.on('close', () => {
    clientNum -= 1;
    onlineUsers = [];

    console.log('Client disconnected. Client number now is ', clientNum)

    //check who are online
    wss.broadcast(JSON.stringify({ 'event': "leave" }))

    wss.broadcast(JSON.stringify({
      type: 'notification',
      clientNum: `${clientNum}`,
      command: 'A user just left.'
    }))
  });
});
