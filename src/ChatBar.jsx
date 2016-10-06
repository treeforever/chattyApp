import React, {Component} from 'react';

class ChatBar extends Component {
  // handleContentChange(event) {
  //   this.setState({content: event.target.value});
  // }

  render() {
    return (
        <footer>
          <input
            id="username"
            type="text"
            placeholder="Your Name (Optional)"
            onKeyUp={this.props.onNameEnter}
            onBlur={this.props.onBlur}
            />

          <input
            id="new-message"
            type="text"
            placeholder="Type a message and hit ENTER"
            onKeyUp={this.props.contentSubmit}
           />
        </footer>
    )
  }
}

export default ChatBar;
