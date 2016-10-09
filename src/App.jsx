import React, {Component} from 'react';
import MessageList from './MessageList.jsx';
import ChatBar from './ChatBar.jsx';
import UserCount from './UserCount.jsx';
import MenuItem from './MenuItem.jsx'

const Menu = require('react-burger-menu').stack;


let setUserIdLimit = 1;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: { name: "Bob", id: undefined, color: undefined },
      data: [],
      clientNum: 0,
      menuIsOpen: false,
      onlineUsers: []
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

      if (setUserIdLimit) {
        this.setState({currentUser: { name: undefined,
                                      id: newMessage.userid,
                                      color: newMessage.color }})

        setUserIdLimit -= 1;
        return;
      }

      if (newMessage.onlineUsersUpdate) {
        this.setState({ onlineUsers: newMessage.onlineUsersUpdate })
        console.log(this.state.onlineUsers)
        return;
      }

      this.setState({
        data: this.state.data.concat([newMessage]),
        clientNum: newMessage.clientNum
      })


    }
  }

  componentDidMount = () => {
    this.initSocket()
    this.sendJoinMsg()
    this.listenBroadcast()
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


  returnUrl = (data) => {
    if (data) {
      let matchUrl = data.match(/(https?|ftp):\/\/.*\.(?:jpg|png|gif|bmp)/)
      if (matchUrl) {
        let url = matchUrl[0]
        return url;
      }
    }
  }

  contentSubmit = (event) => {
    if (event.keyCode === 13) {
      let url = this.returnUrl(event.target.value);

      let newFeed = {
        id: this.uuidGenerator(),
        username: this.state.currentUser.name,
        userid: this.state.currentUser.id,
        color: this.state.currentUser.color,
        content: event.target.value,
        type: "message"
      }

      //overwrite the type to url if there is url in the message
      if (url) {
        newFeed.type = "url";
        newFeed.url = url;
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
        type: "notification",
        'event': "namechange",
        newName: newName,
        userid: this.state.currentUser.id
      }
      this.socket.send(JSON.stringify(newFeed))
      this.state.currentUser.name = event.target.value
    }
  }

  toggleMenu = () => {
    let menuState = this.state.menuIsOpen;
    this.setState({menuIsOpen: !menuState})
  }

  render() {
    return(
      <div className="wrapper">
        <nav>
            <h1>Chatty</h1>
            <UserCount
              userCount={ this.state.clientNum }
              onClick={ this.toggleMenu }
            />
          <Menu isOpen={ this.state.menuIsOpen } customBurgerIcon={ false }>
            <MenuItem onlineUsers={ this.state.onlineUsers }/>
          </Menu>

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
