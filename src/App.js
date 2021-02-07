import React from 'react';
import './App.css';

import "@material/card/dist/mdc.card.css";
import '@material/react-material-icon/dist/material-icon.css';

import parse from 'bookmarks-parser';
import saveAs from 'file-saver';
import get_timestamp from './timestamp';

import I18n from '@marcoparrone/i18n';

import LanguageSelector from '@marcoparrone/react-language-selector';

import {Dialog, open_dialog} from '@marcoparrone/dialog';

import AppWithTopBar from '@marcoparrone/appwithtopbar';

import IconButton from './iconbutton';

import {
  add_node, get_node, change_node_field, delete_node,
  move_node_backward, move_node_forward, move_node_upward, move_node_downward,
  load_nodes, save_nodes
} from '@marcoparrone/nodes';

const defaultText = require ('./en.json');

class Bookmark extends React.Component {
  render() {
    let content = [];
    let count = 0;
    let element = null;
    let keyprefix = "Bookmark" + this.props.id;
    if (this.props.type === 'bookmark') {
      content.push(<label key={keyprefix}>{this.props.title}&nbsp;
                            <a href={this.props.url} target="_blank" rel="noreferrer">
          <IconButton key={keyprefix + "-OpenButton"} label={this.props.text['text_open']} icon='open_in_new' />
        </a>
      </label>);
    } else {
      content.push(<label key={keyprefix + "Label"}>{this.props.title}: </label>);

      content.push(<br key={keyprefix + "Br"} />);

      if (this.props.children !== undefined && this.props.children !== null && this.props.children !== []) {
        count = this.props.children.length;
        for (let i = 0; i < count; i++) {
          element = this.props.children[i];
          if (element.visible !== 0) {
            content.push(<Bookmark
              id={this.props.id + "." + i.toString()}
              key={keyprefix + "." + i.toString()}
              type={element.type}
              title={element.title}
              url={element.url}
              children={element.children}
              showedit={this.props.showedit}
              showmove={this.props.showmove}
              showadd={this.props.showadd}
              addBookmark={this.props.addBookmark}
              editBookmark={this.props.editBookmark}
              movebackwardBookmark={this.props.movebackwardBookmark}
              moveforwardBookmark={this.props.moveforwardBookmark}
              moveupwardBookmark={this.props.moveupwardBookmark}
              movedownwardBookmark={this.props.movedownwardBookmark}
              text={this.props.text}
            />);
          }
        }
      }

      if (this.props.showadd === 'yes') {
        content.push(<IconButton key={keyprefix + "-AddButton"} label={this.props.text['text_add']} icon='add' callback={event => this.props.addBookmark(this.props.id)} />);
      }
    }

    if (this.props.showedit === 'yes') {
      content.push(<IconButton key={keyprefix + "-EditButton"} label={this.props.text['text_edit']} icon='edit' callback={event => this.props.editBookmark(this.props.id)} />);
    }

    if (this.props.showmove === 'yes') {
      content.push(<IconButton key={keyprefix + "-BackwardButton"} label={this.props.text['text_move_backward']} icon='keyboard_arrow_left' callback={event => this.props.movebackwardBookmark(this.props.id)} />);
      content.push(<IconButton key={keyprefix + "-ForwardButton"} label={this.props.text['text_move_forward']} icon='keyboard_arrow_right' callback={event => this.props.moveforwardBookmark(this.props.id)} />);
      content.push(<IconButton key={keyprefix + "-UpwardButton"} label={this.props.text['text_move_upward']} icon='keyboard_arrow_up' callback={event => this.props.moveupwardBookmark(this.props.id)} />);
      content.push(<IconButton key={keyprefix + "-DownwardButton"} label={this.props.text['text_move_downward']} icon='keyboard_arrow_down' callback={event => this.props.movedownwardBookmark(this.props.id)} />);
    }

    return (
      <div className="mdc-card  mdc-card--outlined" key={keyprefix + "Card"}>
        <div className="card-body mdc-typography--body2">
          {content}
        </div>
      </div>
    );
  }
}

class BookmarksList extends React.Component {

  constructor(props) {
    super(props);
    this.bookmarks = [];
    this.cursor = "";
    this.tmptype = 'bookmark';
    this.tmptitle = '';
    this.tmpurl = '';
    this.showedit = 'no';
    this.showmove = 'no';
    this.showadd = 'yes';
    this.i18n = {};

    this.state = {
      bookmarks: this.bookmarks,
      cursor: this.cursor,
      tmptype: this.tmptype,
      tmptitle: this.tmptitle,
      tmpurl: this.tmpurl,
      showedit: this.showedit,
      showmove: this.showmove,
      showadd: this.showadd,
      language: this.i18n.language,
      text: defaultText
    };
    this.deleteBookmark = this.deleteBookmark.bind(this);
    this.addBookmark = this.addBookmark.bind(this);
    this.editBookmark = this.editBookmark.bind(this);
    this.movebackwardBookmark = this.movebackwardBookmark.bind(this);
    this.moveforwardBookmark = this.moveforwardBookmark.bind(this);
    this.moveupwardBookmark = this.moveupwardBookmark.bind(this);
    this.movedownwardBookmark = this.movedownwardBookmark.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSettingsChange = this.handleSettingsChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.importBookmarksReaderOnload = this.importBookmarksReaderOnload.bind(this);
    this.importBookmarks = this.importBookmarks.bind(this);
    this.exportBookmarks = this.exportBookmarks.bind(this);
    this.saveState = this.saveState.bind(this);
    this.bookmarksListRef = React.createRef();
  }

  saveState() {
    if (this.i18n.text) {
      this.setState({
        bookmarks: this.bookmarks,
        cursor: this.cursor,
        tmptype: this.tmptype,
        tmptitle: this.tmptitle,
        tmpurl: this.tmpurl,
        showedit: this.showedit,
        showmove: this.showmove,
        showadd: this.showadd,
        language: this.i18n.language,
        text: this.i18n.text
      });
    } else {
      this.setState({
        bookmarks: this.bookmarks,
        cursor: this.cursor,
        tmptype: this.tmptype,
        tmptitle: this.tmptitle,
        tmpurl: this.tmpurl,
        showedit: this.showedit,
        showmove: this.showmove,
        showadd: this.showadd,
        language: 'en',
        text: defaultText
      });
    }
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
    this.i18n = new I18n(this.saveState);

    // Load the bookmarks from localStorage.
    this.loadBookmarks();
  }

  componentWillUnmount() {

  }

  saveBookmarks() {
    save_nodes(this.bookmarks, 'bookmarks');
    this.setState({bookmarks: this.bookmarks});
  }

  handleSubmit(cursor) {
    change_node_field(this.bookmarks, cursor, 'title', this.state.tmptitle);
    change_node_field(this.bookmarks, cursor, 'type', this.state.tmptype);
    change_node_field(this.bookmarks, cursor, 'url', this.state.tmpurl);
    this.saveBookmarks();
  }

  handleInputChange(e) {
    switch (e.target.name) {
      case 'tmptype':
        if (e.target.checked === true) {
          this.tmptype = e.target.value;
        }
        break;
      case 'tmptitle':
        this.tmptitle = e.target.value;
        break;
      case 'tmpurl':
        this.tmpurl = e.target.value;
        break;
      default:
        break;
    }
    this.saveState();
  }

  handleSettingsChange(e) {
    switch (e.target.name) {
      case 'showedit':
        if (e.target.checked === true) {
          this.showedit = e.target.value;
          localStorage.setItem('bookmarks_showedit', this.showedit);
        }
        break;
      case 'showmove':
        if (e.target.checked === true) {
          this.showmove = e.target.value;
          localStorage.setItem('bookmarks_showmove', this.showmove);
        }
        break;
      case 'showadd':
        if (e.target.checked === true) {
          this.showadd = e.target.value;
          localStorage.setItem('bookmarks_showadd', this.showadd);
        }
        break;
      case 'lang':
        this.i18n.change_language_translate_and_save_to_localStorage(e.target.value);
        break;
      default:
        break;
    }
    this.saveState();
  }

  loadBookmarks() {
    let bookmarks = load_nodes('bookmarks');
    if (bookmarks) {
      this.bookmarks = bookmarks;
      this.saveState();
    }
  }

  addBookmark(cursor) {
    let newbookmark = {
      type: 'bookmark',
      title: '',
      url: "https://",
      visible: 1
    };
    let newCursor = add_node(this.bookmarks, cursor, newbookmark);
    change_node_field(this.bookmarks, newCursor, 'title', this.state.text['text_example_title'] + ' ' + newCursor);
    this.saveBookmarks();
    this.editBookmark(newCursor);
  }

  editBookmark(cursor) {
    let bookmark = get_node(this.bookmarks, cursor);
    if (bookmark) {
      this.cursor = cursor;
      this.tmptype = bookmark.type;
      this.tmptitle = bookmark.title;
      this.tmpurl = bookmark.url;

      this.saveState();
      open_dialog(this.bookmarksListRef, 'editbookmark');
    }
  }

  movebackwardBookmark(cursor) {
    if (move_node_backward(this.bookmarks, cursor)) {
      this.saveBookmarks();
    }
  }

  moveforwardBookmark(cursor) {
    if (move_node_forward(this.bookmarks, cursor)) {
      this.saveBookmarks();
    }
  }

  moveupwardBookmark(cursor) {
    const emptynode = {type: 'bookmark', title: "InvisibleElement", content: "InvisibleContent", visible: 0};
    if (move_node_upward(this.bookmarks, cursor, emptynode)) {
      this.saveBookmarks();
    }
  }

  movedownwardBookmark(cursor) {
    const emptynode = {type: 'bookmark', title: "InvisibleElement", content: "InvisibleContent", visible: 0};
    if (move_node_downward(this.bookmarks, cursor, emptynode)) {
      this.saveBookmarks();
    }
  }

  deleteBookmark(cursor) {
    if (delete_node(this.bookmarks, cursor)) {
      this.saveBookmarks();
      this.forceUpdate();
    }
  }

  importBookmarksReaderOnload(e) {
    let newBookmarks = [];
    let text_error_loadingfile = this.state.text['text_error_loadingfile'];
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
      this.saveBookmarks();
      this.forceUpdate();
    }
  }

  importBookmarks(e) {
    let file = e.target.files[0];
    if (!file) {
      if (e.target.files.length > 0) {
        alert(this.state.text['text_error_loadfile']);
      }
      return;
    }
    let reader = new FileReader();
    reader.onload = this.importBookmarksReaderOnload;
    reader.readAsText(file);
  }

  exportBookmarksHelper(bookmarks) {
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

  exportBookmarks() {
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
    netscapeBookmarks.push(this.exportBookmarksHelper(this.bookmarks));
    netscapeBookmarks.push('</DL><p>');
    saveAs(new Blob([netscapeBookmarks.join('\n')], { type: "text/plain;charset=utf-8" }),
      'bookmarks-' + get_timestamp() + '.html');
  }

  render() {
    let bookmarksRepresentation = [];
    for (let i = 0; i < this.state.bookmarks.length; i++) {
      if (this.bookmarks[i].visible !== 0) {
        bookmarksRepresentation.push(
          <Bookmark
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
            addBookmark={this.addBookmark}
            editBookmark={this.editBookmark}
            movebackwardBookmark={this.movebackwardBookmark}
            moveforwardBookmark={this.moveforwardBookmark}
            moveupwardBookmark={this.moveupwardBookmark}
            movedownwardBookmark={this.movedownwardBookmark}
            text={this.state.text}
          />);
      }
    }
    return (
      <AppWithTopBar refprop={this.bookmarksListRef} lang={this.state.language} appname={this.state.text['text_appname']}
      icons={[{label: this.state.text['text_add_label'], icon: 'add', callback: () => this.addBookmark()},
              {label: this.state.text['text_settings_label'], icon: 'settings', callback: () => open_dialog(this.bookmarksListRef, 'settings')},
              {label: this.state.text['text_importexport_label'], icon: 'import_export', callback: () => open_dialog(this.bookmarksListRef, 'impexp')},
              {label: this.state.text['text_help_label'], icon: 'help', callback: () => open_dialog(this.bookmarksListRef, 'help')},
              {label: this.state.text['text_about_label'], icon: 'info', callback: () =>  open_dialog(this.bookmarksListRef, 'about')}]} >
        <section className="bookmarksSection">
          {bookmarksRepresentation}
        </section>
        <Dialog id="editbookmark" title={this.state.text['text_edit_title']}
                  actions={(<span><input type="submit" value={this.state.text['text_delete']} onClick={event => this.deleteBookmark(this.state.cursor)} className="mdc-button mdc-dialog__button" data-mdc-dialog-action="yes" />
                  <input type="submit" value={this.state.text['text_back']} className="mdc-button mdc-dialog__button" data-mdc-dialog-action="yes" />
                  <input type="submit" value={this.state.text['text_save']} onClick={event => this.handleSubmit(this.state.cursor)} className="mdc-button mdc-dialog__button" data-mdc-dialog-action="yes" /></span>)}>
                  <label>{this.state.text['text_edit_type']}
                    <input type="radio" id="abktypebookmark" name="tmptype" value="bookmark" checked={this.state.tmptype === 'bookmark'} onChange={this.handleInputChange}>
                    </input>{this.state.text['text_edit_bookmark']}
                    <input type="radio" id="abktypefolder" name="tmptype" value="folder" checked={this.state.tmptype === 'folder'} onChange={this.handleInputChange}>
                    </input>{this.state.text['text_edit_folder']}
                  </label><br />
                  <label>{this.state.text['text_edit_bookmark_title']}
                    <input type="text" id="abktitle" name="tmptitle" value={this.state.tmptitle} onChange={this.handleInputChange}></input>
                  </label><br />
                  {this.state.tmptype === 'bookmark' &&
                    <label>{this.state.text['text_edit_url']} <input type="text" id="abkurl" name="tmpurl" value={this.state.tmpurl} onChange={this.handleInputChange}></input></label>}
          </Dialog>
          <Dialog id="settings" title={this.state.text['text_settings_title']} text_close_button={this.state.text['text_close_button']} >
            <p>{this.state.text['text_settings_content1']}</p>
            <label>{this.state.text['text_settings_showedit']}
              <input type="radio" id="showedityes" name="showedit" value="yes" checked={this.state.showedit === 'yes'} onChange={this.handleSettingsChange}>
              </input>{this.state.text['text_yes']}
              <input type="radio" id="showeditno" name="showedit" value="no" checked={this.state.showedit === 'no'} onChange={this.handleSettingsChange}>
              </input>{this.state.text['text_no']}
            </label><br />
            <label>{this.state.text['text_settings_showmove']}
              <input type="radio" id="showmoveyes" name="showmove" value="yes" checked={this.state.showmove === 'yes'} onChange={this.handleSettingsChange}>
              </input>{this.state.text['text_yes']}
              <input type="radio" id="showmoveno" name="showmove" value="no" checked={this.state.showmove === 'no'} onChange={this.handleSettingsChange}>
              </input>{this.state.text['text_no']}
            </label><br />
            <label>{this.state.text['text_settings_showadd']}
              <input type="radio" id="showaddyes" name="showadd" value="yes" checked={this.state.showadd === 'yes'} onChange={this.handleSettingsChange}>
              </input>{this.state.text['text_yes']}
              <input type="radio" id="showaddno" name="showadd" value="no" checked={this.state.showadd === 'no'} onChange={this.handleSettingsChange}>
              </input>{this.state.text['text_no']}
            </label><br />
            <LanguageSelector text_language={this.state.text['text_language']} language={this.state.language} handleSettingsChange={this.handleSettingsChange} />
          </Dialog>
          <Dialog id="impexp" title={this.state.text['text_importexport_title']}
                  actions={(<span>
                    <label>{this.state.text['text_import']}
                    &nbsp;
                    <input type="file" onChange={e => this.importBookmarks(e)} className="mdc-button mdc-dialog__button" data-mdc-dialog-action="yes" /></label>
                    <input type="submit" value={this.state.text['text_back']} className="mdc-button mdc-dialog__button" data-mdc-dialog-action="yes" />
                    <input type="submit" value={this.state.text['text_export']} onClick={event => this.exportBookmarks()} className="mdc-button mdc-dialog__button" data-mdc-dialog-action="yes" /></span>)} >
            <p>{this.state.text['text_importexport_content']}</p>
          </Dialog>
          <Dialog id="help" title={this.state.text['text_help_title']} text_close_button={this.state.text['text_close_button']} >
            <p>{this.state.text['text_help_content1']}</p>
            <p>{this.state.text['text_help_content2']}</p>
            <p>{this.state.text['text_help_content3']}</p>
            <p>{this.state.text['text_help_content4']}</p>
            <p>{this.state.text['text_help_content5']}</p>
            <p>{this.state.text['text_help_content6']}</p>
            <p>{this.state.text['text_help_content7']}</p>
            <p>{this.state.text['text_help_content8']}</p>
          </Dialog>
          <Dialog id="about" title={this.state.text['text_about_title']} text_close_button={this.state.text['text_close_button']} >
            <p>{this.state.text['text_about_content1']}
                <br />{this.state.text['text_about_content2']}</p>
            <p>{this.state.text['text_about_content3']}</p>
            <p>{this.state.text['text_about_content4']}</p>
            <p>{this.state.text['text_about_content5']}</p>
            <p>{this.state.text['text_about_content6']}</p>
          </Dialog>
        </AppWithTopBar>
    );
  }
}

function App() {
  return (
    <div className="App">
      <BookmarksList />
    </div>
  );
}

export default App;
