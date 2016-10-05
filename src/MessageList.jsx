import React, {Component} from 'react';
import Message from './Message.jsx'

class MessageList extends Component {
  render() {
    return (
      <div id="message-list">
        {this.props.messagesForClass.map((message,index) => {
            return (<Message username={message.username} key={index}>
              {message.content}
            </Message>)
        })}
      </div>
    );
  }
}

export default MessageList;
