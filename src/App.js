import React from 'react';
import './App.css';

import "@material/card/dist/mdc.card.css";
import '@material/react-material-icon/dist/material-icon.css';

import parse from 'bookmarks-parser';
import saveAs from 'file-saver';
import get_timestamp from './timestamp';

import I18n from '@marcoparrone/i18n';

import {Dialog, open_dialog} from '@marcoparrone/dialog';

import AppWithTopBar from '@marcoparrone/appwithtopbar';

import {
  add_node, get_node, change_node_field, delete_node,
  move_node_backward, move_node_forward, move_node_upward, move_node_downward,
  load_nodes, save_nodes
} from '@marcoparrone/nodes';

import EditDialog from './edit-dialog';
import SettingsDialog from './settings-dialog';

import Node from './react-node';

const defaultText = require ('./en.json');

class NodesList extends React.Component {

  constructor(props) {
    super(props);
    this.bookmarks = [];
    this.showedit = 'no';
    this.showmove = 'no';
    this.showadd = 'yes';
    this.i18n = { language: 'en', text: defaultText};

    this.state = { bookmarks: this.bookmarks };

    this.deleteNode = this.deleteNode.bind(this);

    this.addNode = this.addNode.bind(this);
    this.openNode = this.openNode.bind(this);
    this.editNode = this.editNode.bind(this);
    this.openSettings = this.openSettings.bind(this);

    this.movebackwardNode = this.movebackwardNode.bind(this);
    this.moveforwardNode = this.moveforwardNode.bind(this);
    this.moveupwardNode = this.moveupwardNode.bind(this);
    this.movedownwardNode = this.movedownwardNode.bind(this);

    this.handleSettingsChange = this.handleSettingsChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.importNodesReaderOnload = this.importNodesReaderOnload.bind(this);
    this.importNodes = this.importNodes.bind(this);
    this.exportNodes = this.exportNodes.bind(this);

    this.bookmarksListRef = React.createRef();
    this.EditDialogRef = React.createRef();
    this.SettingsDialogRef = React.createRef();
  }

  componentDidMount() {
    let showedit = localStorage.getItem('bookmarks_showedit');
    let showmove = localStorage.getItem('bookmarks_showmove');
    let showadd = localStorage.getItem('bookmarks_showadd');
    
    if (showedit === 'yes' || showedit === 'no') {
      this.showedit = showedit;
    }
    if (showmove === 'yes' || showmove === 'no') {
      this.showmove = showmove;
    }
    if (showadd === 'yes' || showadd === 'no') {
      this.showadd = showadd;
    }

    // Localize the User Interface.
    this.i18n = new I18n(() => {this.forceUpdate()});

    // Load the bookmarks from localStorage.
    this.loadNodes();
  }

  componentWillUnmount() {

  }

  saveNodes() {
    save_nodes(this.bookmarks, 'bookmarks');
    this.setState({bookmarks: this.bookmarks});
  }

  handleSubmit(cursor, type, title, url) {
    change_node_field(this.bookmarks, cursor, 'type', type);
    change_node_field(this.bookmarks, cursor, 'title', title);
    change_node_field(this.bookmarks, cursor, 'url', url);
    this.saveNodes();
  }

  handleSettingsChange(showedit, showmove, showadd, language) {
    let toupdate = false;
    if (this.showedit !== showedit) {
      this.showedit=showedit;
      localStorage.setItem('bookmarks_showedit', showedit);
      toupdate = true;
    }
    if (this.showmove !== showmove) {
      this.showmove=showmove;
      localStorage.setItem('bookmarks_showmove', showmove);
      toupdate = true;
    }
    if (this.showadd !== showadd) {
      this.showadd=showadd;
      localStorage.setItem('bookmarks_showadd', showadd);
      toupdate = true;
    }
    if (this.i18n.language !== language) {
      this.i18n.change_language_translate_and_save_to_localStorage(language);
      // changing language already calls forceUpdate
      toupdate=false;
    }
    if (toupdate) {
      this.forceUpdate();
    }
  }

  loadNodes() {
    let bookmarks = load_nodes('bookmarks');
    if (bookmarks) {
      this.bookmarks = bookmarks;
      this.setState({ bookmarks: this.bookmarks });
    }
  }

  addNode(cursor) {
    let newbookmark = {
      type: 'bookmark',
      title: '',
      url: "https://",
      visible: 1
    };
    let newCursor = add_node(this.bookmarks, cursor, newbookmark);
    change_node_field(this.bookmarks, newCursor, 'title', this.i18n.text['text_example_title'] + ' ' + newCursor);
    this.saveNodes();
    this.editNode(newCursor);
  }

  openNode(cursor) {
    let bookmark = get_node(this.bookmarks, cursor);
    if (bookmark) {
      window.open(bookmark.url, '_blank', 'noopener');
    }
  }

  editNode(cursor) {
    let bookmark = get_node(this.bookmarks, cursor);
    if (bookmark) {
      this.EditDialogRef.current.updateState(cursor, bookmark.type, bookmark.title, bookmark.url);
      open_dialog(this.bookmarksListRef, 'editbookmark');
    }
  }

  openSettings() {
    this.SettingsDialogRef.current.updateState(this.showedit, this.showmove, this.showadd, this.i18n.language);
    open_dialog(this.bookmarksListRef, 'settings');
  }

  movebackwardNode(cursor) {
    if (move_node_backward(this.bookmarks, cursor)) {
      this.saveNodes();
    }
  }

  moveforwardNode(cursor) {
    if (move_node_forward(this.bookmarks, cursor)) {
      this.saveNodes();
    }
  }

  moveupwardNode(cursor) {
    const emptynode = {type: 'bookmark', title: "InvisibleElement", content: "InvisibleContent", visible: 0};
    if (move_node_upward(this.bookmarks, cursor, emptynode)) {
      this.saveNodes();
    }
  }

  movedownwardNode(cursor) {
    const emptynode = {type: 'bookmark', title: "InvisibleElement", content: "InvisibleContent", visible: 0};
    if (move_node_downward(this.bookmarks, cursor, emptynode)) {
      this.saveNodes();
    }
  }

  deleteNode(cursor) {
    if (delete_node(this.bookmarks, cursor)) {
      this.saveNodes();
      this.forceUpdate();
    }
  }

  importNodesReaderOnload(e) {
    let newBookmarks = [];
    let text_error_loadingfile = this.i18n.text['text_error_loadingfile'];
    parse(e.target.result,
      function (err, res) {
        if (err) {
          alert(text_error_loadingfile + err);
        } else {
          for (let i = 0; i < res.bookmarks.length; i++) {
            if (res.bookmarks[i].ns_root === 'menu') {
              for (let j = 0; j < res.bookmarks[i].children.length; j++) {
                newBookmarks.push(res.bookmarks[i].children[j]);
              }
            } else {
              newBookmarks.push(res.bookmarks[i]);
            }
          }
        }
      });
    if (newBookmarks.length > 0) {
      // Empty bookmarks array from old entries.
      let oldCount = this.bookmarks.length;
      for (let i = 0; i < oldCount; i++) {
        this.bookmarks.pop();
      }
      // Populate bookmarks array with new imported items.
      for (let i = 0; i < newBookmarks.length; i++) {
        newBookmarks[i].visible = 1;
        this.bookmarks.push(newBookmarks[i]);
      }
      // Save and display.
      this.saveNodes();
      this.forceUpdate();
    }
  }

  importNodes(e) {
    let file = e.target.files[0];
    if (!file) {
      if (e.target.files.length > 0) {
        alert(this.i18n.text['text_error_loadfile']);
      }
      return;
    }
    let reader = new FileReader();
    reader.onload = this.importNodesReaderOnload;
    reader.readAsText(file);
  }

  exportNodesHelper(bookmarks) {
    let bookmarksCount = bookmarks.length;
    let netscapeBookmarks = [];
    for (let i = 0; i < bookmarksCount; i++) {
      if (bookmarks[i].visible !== 0) {
        if (bookmarks[i].type !== 'bookmark') {
          if (bookmarks[i].ns_root === 'toolbar') {
            netscapeBookmarks.push("<DT><H3 PERSONAL_TOOLBAR_FOLDER=\"true\">" + bookmarks[i].title + "</H3>");
          } else if (bookmarks[i].ns_root === 'unsorted') {
            netscapeBookmarks.push("<DT><H3 UNFILED_BOOKMARKS_FOLDER=\"true\">" + bookmarks[i].title + "</H3>");
          } else if (bookmarks[i].ns_root === 'menu') {
            // Don't print it - this menu was added by the parser.
          } else {
            netscapeBookmarks.push("<DT><H3>" + bookmarks[i].title + "</H3>");
          }
          if (bookmarks[i].ns_root !== 'menu') {
            netscapeBookmarks.push("<DL><p>");
          }
          if (bookmarks[i].children !== undefined && bookmarks[i].children !== null && bookmarks[i].children !== []) {
            netscapeBookmarks.push(this.exportBookmarksHelper(bookmarks[i].children));
          }
          if (bookmarks[i].ns_root !== 'menu') {
            netscapeBookmarks.push("</DL><p>");
          }
        } else {
          netscapeBookmarks.push("<DT><A HREF=\"" + bookmarks[i].url + "\">" + bookmarks[i].title + "</A>");
        }
      }
    }
    return netscapeBookmarks.join('\n');
  }

  exportNodes() {
    let netscapeBookmarks = [
      '<!DOCTYPE NETSCAPE-Bookmark-file-1>',
      '<!-- This is an automatically generated file.',
      '     It will be read and overwritten.',
      '     DO NOT EDIT! -->',
      '<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">',
      '<TITLE>Bookmarks</TITLE>',
      '<H1>Bookmarks</H1>',
      '',
      '<DL><p>'
    ];
    netscapeBookmarks.push(this.exportNodesHelper(this.bookmarks));
    netscapeBookmarks.push('</DL><p>');
    saveAs(new Blob([netscapeBookmarks.join('\n')], { type: "text/plain;charset=utf-8" }),
      'bookmarks-' + get_timestamp() + '.html');
  }

  render() {
    let bookmarksRepresentation = [];
    for (let i = 0; i < this.state.bookmarks.length; i++) {
      if (this.bookmarks[i].visible !== 0) {
        bookmarksRepresentation.push(
          <Node
            id={i.toString()}
            key={'Bookmark' + i + ' ' + this.state.bookmarks[i].visible}
            type={this.state.bookmarks[i].type}
            title={this.state.bookmarks[i].title}
            url={this.state.bookmarks[i].url}
            children={this.state.bookmarks[i].children}
            visible={this.state.bookmarks[i].visible}
            showedit={this.showedit}
            showmove={this.showmove}
            showadd={this.showadd}
            addNode={this.addNode}
            openNode={this.openNode}
            editNode={this.editNode}
            movebackwardNode={this.movebackwardNode}
            moveforwardNode={this.moveforwardNode}
            moveupwardNode={this.moveupwardNode}
            movedownwardNode={this.movedownwardNode}
            text={this.i18n.text}
          />);
      }
    }
    return (
      <AppWithTopBar refprop={this.bookmarksListRef} lang={this.i18n.language} appname={this.i18n.text['text_appname']}
      icons={[{label: this.i18n.text['text_add_label'], icon: 'add', callback: () => this.addNode()},
              {label: this.i18n.text['text_settings_label'], icon: 'settings', callback: () => this.openSettings()},
              {label: this.i18n.text['text_importexport_label'], icon: 'import_export', callback: () => open_dialog(this.bookmarksListRef, 'impexp')},
              {label: this.i18n.text['text_help_label'], icon: 'help', callback: () => open_dialog(this.bookmarksListRef, 'help')},
              {label: this.i18n.text['text_about_label'], icon: 'info', callback: () =>  open_dialog(this.bookmarksListRef, 'about')}]} >
        <section className="bookmarksSection">
          {bookmarksRepresentation}
        </section>
          <EditDialog id="EditDialog" ref={this.EditDialogRef} text={this.i18n.text}
           deleteNode={this.deleteNode} handleSubmit={this.handleSubmit} />
          <SettingsDialog id="SettingsDialog" ref={this.SettingsDialogRef} text={this.i18n.text}
           showedit={this.showedit} showmove={this.showmove} showadd={this.showadd} language={this.i18n.language} 
           handleSettingsChange={this.handleSettingsChange} />
          <Dialog id="impexp" title={this.i18n.text['text_importexport_title']}
                  actions={(<span>
                    <label>{this.i18n.text['text_import']}
                    &nbsp;
                    <input type="file" onChange={e => this.importNodes(e)} className="mdc-button mdc-dialog__button" data-mdc-dialog-action="yes" /></label>
                    <input type="submit" value={this.i18n.text['text_back'] || "Back"} className="mdc-button mdc-dialog__button" data-mdc-dialog-action="yes" />
                    <input type="submit" value={this.i18n.text['text_export'] || "Export"} onClick={event => this.exportNodes()} className="mdc-button mdc-dialog__button" data-mdc-dialog-action="yes" /></span>)} >
            <p>{this.i18n.text['text_importexport_content']}</p>
          </Dialog>
          <Dialog id="help" title={this.i18n.text['text_help_title']} text_close_button={this.i18n.text['text_close_button']} >
            <p>{this.i18n.text['text_help_content1']}</p>
            <p>{this.i18n.text['text_help_content2']}</p>
            <p>{this.i18n.text['text_help_content3']}</p>
            <p>{this.i18n.text['text_help_content4']}</p>
            <p>{this.i18n.text['text_help_content5']}</p>
            <p>{this.i18n.text['text_help_content6']}</p>
            <p>{this.i18n.text['text_help_content7']}</p>
            <p>{this.i18n.text['text_help_content8']}</p>
          </Dialog>
          <Dialog id="about" title={this.i18n.text['text_about_title']} text_close_button={this.i18n.text['text_close_button']} >
            <p>{this.i18n.text['text_about_content1']}
                <br />{this.i18n.text['text_about_content2']}</p>
            <p>{this.i18n.text['text_about_content3']}</p>
            <p>{this.i18n.text['text_about_content4']}</p>
            <p>{this.i18n.text['text_about_content5']}</p>
            <p>{this.i18n.text['text_about_content6']}</p>
          </Dialog>
        </AppWithTopBar>
    );
  }
}

function App() {
  return (
    <div className="App">
      <NodesList />
    </div>
  );
}

export default App;
