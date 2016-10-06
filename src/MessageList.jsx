import React, {Component} from 'react';
import Message from './Message.jsx'

class MessageList extends Component {
  render() {
    return (
      <div id="message-list">
        {this.props.messagesForClass.map((message, index) => {
            return (<Message username={message.username} key={index}>
              {message.content}
            </Message>)
        })}
        <div className="notification">
          {this.props.notifications.map( (noti, index) => {
            return (<Notification notification={noti.content} key={index} />)
          })}
        </div>
      </div>
    );
  }
}

class Notification extends Component {
  render() {
    return (
      <article>
        <span className="notification-system">
          System
        </span>
        <span className="notification-content">
          {this.props.notification}
        </span>

      </article>
    )
  }
}

export default MessageList;
