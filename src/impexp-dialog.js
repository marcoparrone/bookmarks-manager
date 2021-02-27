// impexp-dialog.js - Import/export dialog implementation.

import React from 'react';

import { Dialog } from '@marcoparrone/dialog';

export default class ImpExpDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      merge: true
    };
    this.updateState = this.updateState.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleFileImport = this.handleFileImport.bind(this);
    this.FileImportRef = React.createRef();
  }

  updateState(merge) {
    this.setState({
      merge: merge
    });
  }

  handleInputChange(e) {
    switch (e.target.name) {
      case 'merge':
        if (e.target.checked === true) {
          if (e.target.value === 'yes') {
            this.setState({ merge: true });
          } else {
            this.setState({ merge: false });
          }
        }
        break;
      default:
        break;
    }
  }

  handleFileImport(e) {
    this.props.importNodes(e, this.state.merge);
    e.target.value = [];
  }

  render() {
    return (
      <Dialog id="impexp" title={this.props.text['text_importexport_title']}
        actions={(<span>
          <label ref={this.FileImportRef} >{this.props.text['text_import']}
                  &nbsp;
                  <input type="file" id="importfile" onChange={e => this.handleFileImport(e)} className="mdc-button mdc-dialog__button" data-mdc-dialog-action="yes" /></label>
          <input type="submit" value={this.props.text['text_back'] || "Back"} className="mdc-button mdc-dialog__button" data-mdc-dialog-action="yes" />
          <input type="submit" value={this.props.text['text_export'] || "Export"} onClick={event => this.props.exportNodes()} className="mdc-button mdc-dialog__button" data-mdc-dialog-action="yes" /></span>)} >
        <p>{this.props.text['text_importexport_content']}</p>
        <label>{this.props.text['text_question_merge']}
          <br />
          <input type="radio" id="mergeyes" name="merge" value="yes" checked={this.state.merge} onChange={this.handleInputChange}>
          </input>{this.props.text['text_merge']}
          <input type="radio" id="mergeno" name="merge" value="no" checked={!this.state.merge} onChange={this.handleInputChange}>
          </input>{this.props.text['text_replace']}
        </label><br />
      </Dialog>
    );
  }
};
