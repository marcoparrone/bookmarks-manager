// iconbutton.js - A material react component implemeting a button with an icon.


import React from 'react';

import '@material/react-material-icon/dist/material-icon.css';

export default class IconButton extends React.Component {
  render() {
    return (<button
      aria-pressed="false"
      aria-label={this.props.label}
      title={this.props.label}
      onClick={this.props.callback}>
      <i className="material-icons mdc-icon-button__icon">{this.props.icon}</i>
    </button>);
  }
}
