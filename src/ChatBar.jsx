import React, {Component} from 'react';

class ChatBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      content: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
  }

  handleChange(event) {
    this.setState({content: event.target.value});
  }

  handleUsernameChange(event) {
    this.setState({username: event.target.value});
  }

  handleSubmit(event) {
    if (event.keyCode === 13) {
      this.props.onSend(this.state)
    }
  }


  render() {
    return (
        <footer>
          <input
            id="username"
            type="text"
            placeholder="Your Name (Optional)"
            value={this.state.value}
            onChange={this.handleUsernameChange}
            onKeyUp={this.handleSubmit}
            />

          <input
            id="new-message"
            type="text"
            placeholder="Type a message and hit ENTER"
            value={this.state.value}
            onChange={this.handleChange}
            onKeyUp={this.handleSubmit}
           />
        </footer>
    )
  }
}

export default ChatBar;
