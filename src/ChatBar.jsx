import React, {Component} from 'react';

class ChatBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: props.username || '',
      content: '',
      type: 'message',
    };

    this.handleContentChange = this.handleContentChange.bind(this);
    this.handleContentSubmit = this.handleContentSubmit.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleNameSubmit = this.handleNameSubmit.bind(this);
  }

  handleNameChange(event) {
    this.setState({username: event.target.value});
  }

  handleNameSubmit(event) {
    //send notification when user changes name;
    if (event.keyCode === 13) {
      //prohibit empty username;
      if (this.state.username.length === 0 &&
          this.state.content.length !== 0
        ) {
        return;
      }

      if (this.state.username.length !== 0) {
        this.setState({
          type: "notification"
          content: "${}"})

        this.props.onSendNotification(this.state)
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
      //send the msg to websocket server & reset input value;
      this.setState({type: 'message'})
      this.props.onSend(this.state)
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
