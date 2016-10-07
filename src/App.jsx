import React, {Component} from 'react';
import MessageList from './MessageList.jsx';
import ChatBar from './ChatBar.jsx';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: {name: "Bob"},
      data: []
    };
  }

  initSocket = () => {
    this.socket = new WebSocket("ws://localhost:4000", 'JSON');
  }

  sendJoinMsg = () => {
    this.socket.onopen = (event) => {
      this.socket.send(
        JSON.stringify({
          username: 'system',
          command: `${this.state.currentUser.name} just joined the room`,
          type: 'notification',
          clientNum: 0
        })
      )
    }
  }

  listenBroadcast = () => {
    this.socket.onmessage = (event) => {
      let newMessage = JSON.parse(event.data)
      console.log("listen is", event.data)
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

  componentDidMount = () => {
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

  contentSubmit = (event) => {
    if (event.keyCode === 13) {
      // prohibit empty content;
      // if (event.target.value === 0)
      //
      //     // this.state.data.username.length === 0
      //   {
      //   return;
      // }

      let newFeed = {
        id: this.uuidGenerator(),
        username: this.state.currentUser.name,
        content: event.target.value,
        type: "message"
      }
      this.socket.send(JSON.stringify(newFeed))
      event.target.value = ''
    }
  }

  onBlur = (event) => {
    this.newNameSubmit(event);
  }

  onNameEnter = (event) => {
    if (event.keyCode === 13) {
      this.newNameSubmit(event);
    }
  }


  newNameSubmit = (event) => {
    let oldName = this.state.currentUser.name
    let newName= event.target.value

    if (oldName !== newName) {
      let newFeed = {
        command: `${oldName} just changed name to ${newName}`,
        type: "notification"
      }
      this.socket.send(JSON.stringify(newFeed))
      this.state.currentUser.name = event.target.value
    }
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
          content={ this.state.data.content }
          contentSubmit={ this.contentSubmit }
          onNameEnter={ this.onNameEnter }
          onBlur={ this.onBlur }
        />
      </div>
    )
  }
}

export default App;
