import React, {Component} from 'react';

class Message extends React.Component {
  render(){
    let currentColor = this.props.userColor;
    console.log(typeof currentColor);
    return (
      <div className="message">
        <span className="username" style={ {color: currentColor}}>
          <b>{this.props.username}</b>
        </span>
        <span className="content">
          {this.props.children}
        </span>
      </div>
    );
  }
}

export default Message;
