import React, {Component} from 'react';
import MessageList from './MessageList.jsx';
import ChatBar from './ChatBar.jsx';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: {name: "Bob"},
      messages: [],
      notifications: [
        {content: "User A just changed name to User B"},
        {content: "User D just sent flowers to User C"}
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
          username: 'host',
          content: `User ${this.state.currentUser.name} just joined`
        })
      )
    }
  }

  listenBroadcast() {
    this.socket.onmessage = (event) => {
      let newMessage = JSON.parse(event.data)
      if (newMessage.type === "notification") {
        this.setState({
          username: 'host',
        })
      }
      this.setState({
        messages: this.state.messages.concat([newMessage])
      })
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
    // this.setState({
    //   messages: this.state.messages.concat([message])
    // })
    this.socket.send(JSON.stringify(message))
  }

  sendNotification(notification) {
    this.socket.send(JSON.stringify(notification))
  }

  render() {
    return(
      <div className="wrapper">
        <nav>
            <h1>Chatty</h1>
        </nav>
        <MessageList
          messagesForClass={ this.state.messages }
          notifications={this.state.notifications}/>
        <ChatBar
          username={ this.state.currentUser.name }
          onSend={ this.sendMessage }
          onSendNotification={ this.sendNotification }/>
      </div>
    )
  }
}



export default App;
