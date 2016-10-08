import React, {Component} from 'react';

function Noun(count){
  if (count > 1) {
    return "users online";
  } else {
    return "user online"
  }
}

class UserCount extends Component {
  render() {
    return (
      <div style={{ cursor: "pointer"}}>
        <p onClick={this.props.onClick}>
          {this.props.userCount} {Noun(this.props.userCount)}
        </p>
      </div>
    )
  }
}



export default UserCount;
