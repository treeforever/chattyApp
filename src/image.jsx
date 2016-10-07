import React, {Component} from 'react';

class Images extends Component {
  render() {
    let currentColor = this.props.color;
    return (
      <div>
        <span className="username" style={ {color: currentColor} }>
          <b>{this.props.username}</b>
        </span>
        <span id="image-content">{this.props.content}</span>
        <div className="image"><img src={this.props.url} /></div>

      </div>

    )
  }
}

export default Images;
