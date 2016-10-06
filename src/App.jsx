import React, {Component} from 'react';
import MessageList from './MessageList.jsx';
import ChatBar from './ChatBar.jsx';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: {name: "Bob"},
      data: [
        { username: "user A",
          command: "User A just changed name to User B",
          type: "notification"},
        { username: "user D",
          command: "User D just sent flowers to User C",
          type: "notification"}

      ]
    };
    this.sendMessage = this.sendMessage.bind(this)
    this.sendNotification = this.sendNotification.bind(this)
  }

  initSocket(cb) {
    this.socket = new WebSocket("ws://localhost:4000", 'JSON');
  }



  sendJoinMsg() {
    this.socket.onopen = (event) => {
      this.socket.send(
        JSON.stringify({
          username: 'system',
          command: `${this.state.currentUser.name} just joined the room`,
          type: 'notification'
        })
      )
    }
  }

  listenBroadcast() {
    this.socket.onmessage = (event) => {
      let newMessage = JSON.parse(event.data)
      console.log("from listenBroadcast-event.data is ", event.data)
      if (newMessage.type === "notification") {
        this.setState({
          data: this.state.data.concat([newMessage])
        })
      } else {
        this.setState({
          data: this.state.data.concat([newMessage])
        })
      }
    }
  }

  componentDidMount() {
    //set websocket connection
    this.initSocket()
    this.sendJoinMsg()
    this.listenBroadcast()


  }

  componentDidUnount() {
    // disconnect the socket when unmount
  }

  uuidGenerator() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
  }

  sendMessage(message) {
    message.id = this.uuidGenerator();
    this.socket.send(JSON.stringify(message))
    console.log("from message channel")
  }

  sendNotification(notification) {
    this.socket.send(JSON.stringify(notification))
    console.log("from notification channel", notification)
  }

  render() {
    return(
      <div className="wrapper">
        <nav>
            <h1>Chatty</h1>
        </nav>
        <MessageList
          data={ this.state.data }/>
        <ChatBar
          username={ this.state.currentUser.name }
          onSend={ this.sendMessage }
          onSendNotification={ this.sendNotification }/>
      </div>
    )
  }
}



export default App;
