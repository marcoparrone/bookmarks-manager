// edit-dialog.js - Edit dialog implementation.

import React from 'react';

import { Dialog } from '@marcoparrone/dialog';

export default class EditDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cursor: '',
      type: 'bookmark',
      title: '',
      url: ''
    };
    this.updateState = this.updateState.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  updateState(cursor, type, title, url) {
    this.setState({
      cursor: cursor,
      type: type,
      title: title,
      url: url
    });
  }

  handleInputChange(e) {
    switch (e.target.name) {
      case 'type':
        if (e.target.checked === true) {
          this.setState({type: e.target.value});
        }
        break;
      case 'title':
        this.setState({title: e.target.value});
        break;
      case 'url':
        this.setState({url: e.target.value});
        break;
      default:
        break;
    }
  }

  render() {
    return (
      <Dialog id="editbookmark" title={this.props.text['text_edit_title']}
        actions={(<span><input type="submit" value={this.props.text['text_delete'] || "Delete"} onClick={event => this.props.deleteBookmark(this.state.cursor)} className="mdc-button mdc-dialog__button" data-mdc-dialog-action="yes" />
          <input type="submit" value={this.props.text['text_back']  || "Back"} className="mdc-button mdc-dialog__button" data-mdc-dialog-action="yes" />
          <input type="submit" value={this.props.text['text_save']  || "Save"} onClick={event => this.props.handleSubmit(this.state.cursor, this.state.type, this.state.title, this.state.url)} className="mdc-button mdc-dialog__button" data-mdc-dialog-action="yes" /></span>)}>
        <label>{this.props.text['text_edit_type']}
          <input type="radio" id="abktypebookmark" name="type" value="bookmark" checked={this.state.type === 'bookmark'} onChange={this.handleInputChange}>
          </input>{this.props.text['text_edit_bookmark']}
          <input type="radio" id="abktypefolder" name="type" value="folder" checked={this.state.type === 'folder'} onChange={this.handleInputChange}>
          </input>{this.props.text['text_edit_folder']}
        </label><br />
        <label>{this.props.text['text_edit_bookmark_title']}
          <input type="text" id="abktitle" name="title" value={this.state.title} onChange={this.handleInputChange}></input>
        </label><br />
        {this.state.type === 'bookmark' &&
          <label>{this.props.text['text_edit_url']} <input type="text" id="abkurl" name="url" value={this.state.url} onChange={this.handleInputChange}></input></label>}
      </Dialog>
    );
  }
};
