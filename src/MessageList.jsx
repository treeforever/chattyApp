import React, {Component} from 'react';
import Message from './Message.jsx'
import Images from './Image.jsx';

class MessageList extends Component {
  render() {
    return (
      <div id="message-list">
        {this.props.data.map((post, index) => {
          if (post.type === "message") {
            return (
              <Message username={post.username} key={index} color={post.color}>
                {post.content}
              </Message>
            )
          }

          else if (post.type === "notification") {
            return (
              <Notification notification={post.command} key={index} />
            )
          }

          else if (post.url) {
            return (
              <Images url={post.url} username={post.username} content={post.content} key={index} color={post.color} />
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
