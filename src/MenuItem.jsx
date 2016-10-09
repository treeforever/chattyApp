import React, {Component} from 'react';

class MenuItem extends Component {
  render() {
    return (
      <div>
        {this.props.onlineUsers.map((item, index) => {
          return (
            <a className="menu-item" key={index}>{item.username}<br /></a>
            )
        })}
      </div>

    )
  }
}


export default MenuItem;
