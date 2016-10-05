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

  componentDidMount() {
    console.log("componentDidMount <App />");
    setTimeout(() => {
      console.log("Simulating incoming message");
      // Add a new message to the list of messages in the data store
      this.state.messages.push({id: 3, username: "Michelle", content: "Hello there!"});
      // Update the state of the app component. This will call render()
      this.setState({data: this.state.data})
    }, 3000);

    //set websocket connection
  }

  uuidGenerator() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
  };

  sendMessage(message) {
    message.id = this.uuidGenerator();

    this.setState({
      messages: this.state.messages.concat([message])
    })
    const socket = new WebSocket("ws://localhost:4000", 'JSON');
    socket.onopen = (event) => {
      socket.send(JSON.stringify(message));
    };
  }

  



  render() {
    return(
      <div className="wrapper">
        <nav>
            <h1>Chatty</h1>
        </nav>
        <MessageList messagesForClass={this.state.messages}/>
        <ChatBar

          onSend={ this.sendMessage } />
      </div>
    )
  }
}



export default App;
