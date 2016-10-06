import React, {Component} from 'react';

class ChatBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: props.username || '',
      content: '',
      type: 'message',
      oldName: props.username || ''
    };

    this.handleContentChange = this.handleContentChange.bind(this);
    this.handleContentSubmit = this.handleContentSubmit.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleNameSubmit = this.handleNameSubmit.bind(this);
  }

  handleNameDiff = (event) => {
    this.state.odlName = this.state.username;
  }

  test = (event) => {
    console.log (this.state);
  }

  handleNameChange(event) {
    this.setState({
      username: event.target.value
    });
  }

  handleNameSubmit(event) {
    //send notification when user changes name;
    if (event.keyCode === 13) {
      console.log("oldname is ", this.state.odlName, "this.state.name is ", this.state.username);
      if (this.state.username !== this.state.odlName ) {
        this.setState({
          oldName: this.state.username
        });

        let newState = {
          type: 'notification',
          command: `${this.state.oldName} just changed username to ${this.state.username}`
        };
        this.setState(newState)
        console.log(this.state)
        console.log("oldname is ", this.state.odlName, "this.state.name is ", this.state.username);
        this.props.onSendNotification(newState)

      }
    }
  }

  handleContentChange(event) {
    this.setState({content: event.target.value});
  }

  handleContentSubmit(event) {
    if (event.keyCode === 13) {
      //prohibit empty content;
      if (this.state.content.length === 0 ||
          this.state.username.length === 0
        ){
        return;
      }
      let newState = this.state;
      newState['type'] = "message";
      //send the msg to websocket server & reset input value;
      this.setState(newState)

      this.props.onSend(newState)
      this.setState({content: ''})
    }
  }

  render() {
    return (
        <footer>
          <input
            id="username"
            type="text"
            placeholder="Your Name (Optional)"
            value={this.state.username}
            onChange={this.handleNameChange}
            onKeyUp={this.handleNameSubmit}
            onBlur={this.test}
            />

          <input
            id="new-message"
            type="text"
            placeholder="Type a message and hit ENTER"
            value={this.state.content}
            onChange={this.handleContentChange}
            onKeyUp={this.handleContentSubmit}
           />
        </footer>
    )
  }
}

export default ChatBar;
