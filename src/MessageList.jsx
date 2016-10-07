import React, {Component} from 'react';
import Message from './Message.jsx'

class MessageList extends Component {
  render() {
    return (
      <div id="message-list">
        {this.props.data.map((post, index) => {
          if (post.type === "message") {
            return (
              <Message username={post.username} key={index} userColor={this.props.userColor}>
                {post.content}
              </Message>
            )
          }
          else if (post.type === "notification") {
            return (
              <Notification notification={post.command} key={index} userColor={this.props.userColor}/>
            )
          }
          else {
            console.log("unrecognized post type");
          }
        })
      }
      </div>);
  }
}

class Notification extends Component {
  render() {
    return (
      <article className="notification">
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
