import React, {Component} from 'react';

class UserCount extends Component {
  render() {
    if(this.props.userCount < 2) {
      return (
        <header>
          <p>{this.props.userCount} user online</p>
        </header>
      )
    } else {
      return (
        <header>
          <p>{this.props.userCount} users online</p>
        </header>
      )
    }
  }
}

export default UserCount;
