import React, {Component} from 'react';

class Message extends React.Component {
  render(){
    return (
      <div>
        <span className="username"><b>{this.props.username}   </b>
        </span>
        <span className="content">{this.props.children}</span>
      </div>
    );
  }
}

export default Message;
