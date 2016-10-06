import React, {Component} from 'react';
import MessageList from './MessageList.jsx';
import ChatBar from './ChatBar.jsx';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: {name: "Bob"},
      messages: []
    };
    this.sendMessage = this.sendMessage.bind(this)
  }

  initSocket() {
    this.socket = new WebSocket("ws://localhost:4000", 'JSON');
  }

  joiningRoom() {
    this.socket.onopen = (event) => {
      this.socket.send(JSON.stringify({
        username: this.state.currentUser.name,
        command: "join"
      }))
    }
  }

  listenBroadcast() {
    this.socket.onmessage = (event) => {
      let message = JSON.parse(event.data)
      if (message.command === 'join') {
        message = {
          username: "server",
          content: `${ message.username } just joined the room`
        }
      }
      this.setState({
        messages: this.state.messages.concat([message])
      })
    }
  }

  componentDidMount() {
    this.initSocket()
    this.joiningRoom()
    this.listenBroadcast()
    // console.log("componentDidMount <App />");
    // setTimeout(() => {
    //   console.log("Simulating incoming message");
    //   // Add a new message to the list of messages in the data store
    //   this.state.messages.push({id: 3, username: "Michelle", content: "Hello there!"});
    //   // Update the state of the app component. This will call render()
    //   this.setState({data: this.state.data})
    // }, 3000);

    //set websocket connection
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

    console.log(message)
    this.socket.send(JSON.stringify(message))


    // this.setState({
    //   messages: this.state.messages.concat([message])
    // })
    //
    // socket.onmessage = (event) => {
    //
    //   var newMessage = {
    //     username: JSON.parse(event.data).username,
    //     content: JSON.parse(event.data).content
    //   }
    //   return newMessage;
    // }
    //
    // if(socket.onmessage()) {
    //   this.setState({
    //     messages: this.state.messages.concat(socket.onmessage())
    //   })
    //   debugger;
    // }

  }

  // receiveMessage() {
    // const socket = new WebSocket("ws://localhost:4000", 'JSON');
    // socket.onmessage = (event) => {
    //   var newMessage = {
    //     username: event.data.username,
    //     content: event.data.content
    //   }
    //   console.log(newMessage);
    //   this.setState({
    //     messages: this.state.messages.concat([newMessage])
    //   })
    // }
  // }




  render() {
    return(
      <div className="wrapper">
        <nav>
            <h1>Chatty</h1>
        </nav>
        <MessageList messagesForClass={this.state.messages}/>
        <ChatBar
          username={ this.state.currentUser.name }
          onSend={ this.sendMessage } />
      </div>
    )
  }
}



export default App;
