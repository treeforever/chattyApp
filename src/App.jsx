import React, {Component} from 'react';
import MessageList from './MessageList.jsx';
import ChatBar from './ChatBar.jsx';
import UserCount from './UserCount.jsx';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: {name: "Bob"},
      data: [],
      clientNum: 0
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
        })
      )
    }
  }

  listenBroadcast = () => {
    this.socket.onmessage = (event) => {
      let newMessage = JSON.parse(event.data)

      //listen to userid msg
      if (newMessage.userColor){
        createCookie(this.uuidGenerator(), newMessage.userColor);
        return;
      }

      this.setState({
        data: this.state.data.concat([newMessage]),
        clientNum: newMessage.clientNum
      })
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
            <UserCount
              userCount={ this.state.clientNum }
            />
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

export default App;
