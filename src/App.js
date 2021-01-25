import React from 'react';
import './App.css';

import '@material/react-top-app-bar/dist/top-app-bar.css';
import '@material/react-material-icon/dist/material-icon.css';

import TopAppBar, {
  TopAppBarFixedAdjust,
  TopAppBarIcon,
  TopAppBarRow,
  TopAppBarSection,
  TopAppBarTitle,
} from '@material/react-top-app-bar';
import MaterialIcon from '@material/react-material-icon';

import "@material/dialog/dist/mdc.dialog.css";
import { MDCDialog } from '@material/dialog';

import "@material/card/dist/mdc.card.css";

import I18n from '@marcoparrone/i18n';

import parse from 'bookmarks-parser';

import saveAs from 'file-saver';

import get_timestamp from './timestamp';

import LanguageSelector from '@marcoparrone/react-language-selector';

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
          <button
            key={keyprefix + "OpenButton"}
            aria-pressed="false"
            aria-label={this.props.text_open}
            title={this.props.text_open}>
            <i className="material-icons mdc-icon-button__icon">open_in_new</i>
          </button>
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
              text_open={this.props.text_open}
              text_add={this.props.text_add}
              text_edit={this.props.text_edit}
              text_move_backward={this.props.text_move_backward}
              text_move_forward={this.props.text_move_forward}
              text_move_upward={this.props.text_move_upward}
              text_move_downward={this.props.text_move_downward}
            />);
          }
        }
      }

      if (this.props.showadd === 'yes') {
        content.push(<button
          key={keyprefix + "AddButton"}
          aria-pressed="false"
          aria-label={this.props.text_add}
          title={this.props.text_add}
          onClick={event => this.props.addBookmark(this.props.id)}>
          <i className="material-icons mdc-icon-button__icon">add</i>
        </button>);
      }
    }

    if (this.props.showedit === 'yes') {
      content.push(<button
        key={keyprefix + "EditButton"}
        aria-pressed="false"
        aria-label={this.props.text_edit}
        title={this.props.text_edit}
        onClick={event => this.props.editBookmark(this.props.id)}>
        <i className="material-icons mdc-icon-button__icon">edit</i>
      </button>);
    }

    if (this.props.showmove === 'yes') {
      content.push(<button
        key={keyprefix + "BackwardButton"}
        aria-pressed="false"
        aria-label={this.props.text_move_backward}
        title={this.props.text_move_backward}
        onClick={event => this.props.movebackwardBookmark(this.props.id)}>
        <i className="material-icons mdc-icon-button__icon">keyboard_arrow_left</i>
      </button>);
      content.push(<button
        key={keyprefix + "ForwardButton"}
        aria-pressed="false"
        aria-label={this.props.text_move_forward}
        title={this.props.text_move_forward}
        onClick={event => this.props.moveforwardBookmark(this.props.id)}>
        <i className="material-icons mdc-icon-button__icon">keyboard_arrow_right</i>
      </button>);
      content.push(<button
        key={keyprefix + "UpwardButton"}
        aria-pressed="false"
        aria-label={this.props.text_move_upward}
        title={this.props.text_move_upward}
        onClick={event => this.props.moveupwardBookmark(this.props.id)}>
        <i className="material-icons mdc-icon-button__icon">keyboard_arrow_up</i>
      </button>);
      content.push(<button
        key={keyprefix + "DownwardButton"}
        aria-pressed="false"
        aria-label={this.props.text_move_downward}
        title={this.props.text_move_downward}
        onClick={event => this.props.movedownwardBookmark(this.props.id)}>
        <i className="material-icons mdc-icon-button__icon">keyboard_arrow_down</i>
      </button>);
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
    this.cursor = -1;
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
      text_appname: defaultText['text_appname'],
      text_add_label: defaultText['text_add_label'],
      text_settings_label: defaultText['text_settings_label'],
      text_importexport_label: defaultText['text_importexport_label'],
      text_help_label: defaultText['text_help_label'],
      text_about_label: defaultText['text_about_label'],
      text_edit_title: defaultText['text_edit_title'],
      text_edit_type: defaultText['text_edit_type'],
      text_edit_bookmark: defaultText['text_edit_bookmark'],
      text_edit_folder: defaultText['text_edit_folder'],
      text_edit_bookmark_title: defaultText['text_edit_bookmark_title'],
      text_edit_url: defaultText['text_edit_url'],
      text_delete: defaultText['text_delete'],
      text_back: defaultText['text_back'],
      text_save: defaultText['text_save'],
      text_settings_title: defaultText['text_settings_title'],
      text_settings_content1: defaultText['text_settings_content1'],
      text_yes: defaultText['text_yes'],
      text_no: defaultText['text_no'],
      text_settings_showedit: defaultText['text_settings_showedit'],
      text_settings_showmove: defaultText['text_settings_showmove'],
      text_settings_showadd: defaultText['text_settings_showadd'],
      text_language: defaultText['text_language'],
      text_close_button: defaultText['text_close_button'],
      text_importexport_title: defaultText['text_importexport_title'],
      text_importexport_content: defaultText['text_importexport_content'],
      text_import: defaultText['text_import'],
      text_export: defaultText['text_export'],
      text_error_loadfile: defaultText['text_error_loadfile'],
      text_error_loadingfile: defaultText['text_error_loadingfile'],
      text_example_title: defaultText['text_example_title'],
      text_example_url: defaultText['text_example_url'],
      text_open: defaultText['text_open'],
      text_add: defaultText['text_add'],
      text_edit: defaultText['text_edit'],
      text_move_backward: defaultText['text_move_backward'],
      text_move_forward: defaultText['text_move_forward'],
      text_move_upward: defaultText['text_move_upward'],
      text_move_downward: defaultText['text_move_downward'],
      text_help_title: defaultText['text_help_title'],
      text_about_title: defaultText['text_about_title'],
      text_help_content1: defaultText['text_help_content1'],
      text_help_content2: defaultText['text_help_content2'],
      text_help_content3: defaultText['text_help_content3'],
      text_help_content4: defaultText['text_help_content4'],
      text_help_content5: defaultText['text_help_content5'],
      text_help_content6: defaultText['text_help_content6'],
      text_help_content7: defaultText['text_help_content7'],
      text_help_content8: defaultText['text_help_content8'],
      text_about_content1: defaultText['text_about_content1'],
      text_about_content2: defaultText['text_about_content2'],
      text_about_content3: defaultText['text_about_content3'],
      text_about_content4: defaultText['text_about_content4'],
      text_about_content5: defaultText['text_about_content5'],
      text_about_content6: defaultText['text_about_content6']
    };
    this.deleteBookmark = this.deleteBookmark.bind(this);
    this.addBookmark = this.addBookmark.bind(this);
    this.editBookmark = this.editBookmark.bind(this);
    this.swapBookmarks = this.swapBookmarks.bind(this);
    this.movebackwardBookmark = this.movebackwardBookmark.bind(this);
    this.moveforwardBookmark = this.moveforwardBookmark.bind(this);
    this.moveupwardBookmark = this.moveupwardBookmark.bind(this);
    this.movedownwardBookmark = this.movedownwardBookmark.bind(this);
    this.about = this.about.bind(this);
    this.help = this.help.bind(this);
    this.Settings = this.Settings.bind(this);
    this.importExportBookmarks = this.importExportBookmarks.bind(this);
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
        text_appname: this.i18n.text['text_appname'],
        text_add_label: this.i18n.text['text_add_label'],
        text_settings_label: this.i18n.text['text_settings_label'],
        text_importexport_label: this.i18n.text['text_importexport_label'],
        text_help_label: this.i18n.text['text_help_label'],
        text_about_label: this.i18n.text['text_about_label'],
        text_edit_title: this.i18n.text['text_edit_title'],
        text_edit_type: this.i18n.text['text_edit_type'],
        text_edit_bookmark: this.i18n.text['text_edit_bookmark'],
        text_edit_folder: this.i18n.text['text_edit_folder'],
        text_edit_bookmark_title: this.i18n.text['text_edit_bookmark_title'],
        text_edit_url: this.i18n.text['text_edit_url'],
        text_delete: this.i18n.text['text_delete'],
        text_back: this.i18n.text['text_back'],
        text_save: this.i18n.text['text_save'],
        text_settings_title: this.i18n.text['text_settings_title'],
        text_settings_content1: this.i18n.text['text_settings_content1'],
        text_yes: this.i18n.text['text_yes'],
        text_no: this.i18n.text['text_no'],
        text_settings_showedit: this.i18n.text['text_settings_showedit'],
        text_settings_showmove: this.i18n.text['text_settings_showmove'],
        text_settings_showadd: this.i18n.text['text_settings_showadd'],
        text_language: this.i18n.text['text_language'],
        text_close_button: this.i18n.text['text_close_button'],
        text_importexport_title: this.i18n.text['text_importexport_title'],
        text_importexport_content: this.i18n.text['text_importexport_content'],
        text_import: this.i18n.text['text_import'],
        text_export: this.i18n.text['text_export'],
        text_error_loadfile: this.i18n.text['text_error_loadfile'],
        text_error_loadingfile: this.i18n.text['text_error_loadingfile'],
        text_example_title: this.i18n.text['text_example_title'],
        text_example_url: this.i18n.text['text_example_url'],
        text_open: this.i18n.text['text_open'],
        text_add: this.i18n.text['text_add'],
        text_edit: this.i18n.text['text_edit'],
        text_move_backward: this.i18n.text['text_move_backward'],
        text_move_forward: this.i18n.text['text_move_forward'],
        text_move_upward: this.i18n.text['text_move_upward'],
        text_move_downward: this.i18n.text['text_move_downward'],
        text_help_title: this.i18n.text['text_help_title'],
        text_about_title: this.i18n.text['text_about_title'],
        text_help_content1: this.i18n.text['text_help_content1'],
        text_help_content2: this.i18n.text['text_help_content2'],
        text_help_content3: this.i18n.text['text_help_content3'],
        text_help_content4: this.i18n.text['text_help_content4'],
        text_help_content5: this.i18n.text['text_help_content5'],
        text_help_content6: this.i18n.text['text_help_content6'],
        text_help_content7: this.i18n.text['text_help_content7'],
        text_help_content8: this.i18n.text['text_help_content8'],
        text_about_content1: this.i18n.text['text_about_content1'],
        text_about_content2: this.i18n.text['text_about_content2'],
        text_about_content3: this.i18n.text['text_about_content3'],
        text_about_content4: this.i18n.text['text_about_content4'],
        text_about_content5: this.i18n.text['text_about_content5'],
        text_about_content6: this.i18n.text['text_about_content6']
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
        language: this.i18n.language,
        text_appname: defaultText['text_appname'],
        text_add_label: defaultText['text_add_label'],
        text_settings_label: defaultText['text_settings_label'],
        text_importexport_label: defaultText['text_importexport_label'],
        text_help_label: defaultText['text_help_label'],
        text_about_label: defaultText['text_about_label'],
        text_edit_title: defaultText['text_edit_title'],
        text_edit_type: defaultText['text_edit_type'],
        text_edit_bookmark: defaultText['text_edit_bookmark'],
        text_edit_folder: defaultText['text_edit_folder'],
        text_edit_bookmark_title: defaultText['text_edit_bookmark_title'],
        text_edit_url: defaultText['text_edit_url'],
        text_delete: defaultText['text_delete'],
        text_back: defaultText['text_back'],
        text_save: defaultText['text_save'],
        text_settings_title: defaultText['text_settings_title'],
        text_settings_content1: defaultText['text_settings_content1'],
        text_yes: defaultText['text_yes'],
        text_no: defaultText['text_no'],
        text_settings_showedit: defaultText['text_settings_showedit'],
        text_settings_showmove: defaultText['text_settings_showmove'],
        text_settings_showadd: defaultText['text_settings_showadd'],
        text_language: defaultText['text_language'],
        text_close_button: defaultText['text_close_button'],
        text_importexport_title: defaultText['text_importexport_title'],
        text_importexport_content: defaultText['text_importexport_content'],
        text_import: defaultText['text_import'],
        text_export: defaultText['text_export'],
        text_error_loadfile: defaultText['text_error_loadfile'],
        text_error_loadingfile: defaultText['text_error_loadingfile'],
        text_example_title: defaultText['text_example_title'],
        text_example_url: defaultText['text_example_url'],
        text_open: defaultText['text_open'],
        text_add: defaultText['text_add'],
        text_edit: defaultText['text_edit'],
        text_move_backward: defaultText['text_move_backward'],
        text_move_forward: defaultText['text_move_forward'],
        text_move_upward: defaultText['text_move_upward'],
        text_move_downward: defaultText['text_move_downward'],
        text_help_title: defaultText['text_help_title'],
        text_about_title: defaultText['text_about_title'],
        text_help_content1: defaultText['text_help_content1'],
        text_help_content2: defaultText['text_help_content2'],
        text_help_content3: defaultText['text_help_content3'],
        text_help_content4: defaultText['text_help_content4'],
        text_help_content5: defaultText['text_help_content5'],
        text_help_content6: defaultText['text_help_content6'],
        text_help_content7: defaultText['text_help_content7'],
        text_help_content8: defaultText['text_help_content8'],
        text_about_content1: defaultText['text_about_content1'],
        text_about_content2: defaultText['text_about_content2'],
        text_about_content3: defaultText['text_about_content3'],
        text_about_content4: defaultText['text_about_content4'],
        text_about_content5: defaultText['text_about_content5'],
        text_about_content6: defaultText['text_about_content6']
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

  Settings() {
    const dialog = new MDCDialog(this.bookmarksListRef.current.querySelector('#settings'));
    dialog.open();
  }

  importExportBookmarks() {
    const dialog = new MDCDialog(this.bookmarksListRef.current.querySelector('#impexp'));
    dialog.open();
  }

  help() {
    const dialog = new MDCDialog(this.bookmarksListRef.current.querySelector('#help'));
    dialog.open();
  }

  about() {
    const dialog = new MDCDialog(this.bookmarksListRef.current.querySelector('#about'));
    dialog.open();
  }

  saveBookmarks() {
    let newBookmarks = [];

    // I don't want for the visible value to grow indefinitely.
    for (let i = 0; i < this.bookmarks.length; i++) {
      if (this.bookmarks[i].visible > 100) {
        this.bookmarks[i].visible -= 100;
      }
    }

    // Save in current state.
    this.saveState();

    // Save in local storage, skipping deleted bookmarks.
    for (let i = 0; i < this.bookmarks.length; i++) {
      if (this.bookmarks[i].visible !== 0) {
        newBookmarks.push(this.bookmarks[i]);
      }
    }
    localStorage.setItem('bookmarks', JSON.stringify(newBookmarks));
  }

  handleSubmit(cursor) {
    let newCursor = cursor.toString().split(".");
    let bookmark = null;
    if (newCursor.length > 0) {
      bookmark = this.bookmarks[newCursor[0]];
    }
    for (let i = 1; i < newCursor.length; i++) {
      bookmark = bookmark.children[newCursor[i]];
    }
    bookmark.title = this.state.tmptitle;
    bookmark.type = this.state.tmptype;
    bookmark.url = this.state.tmpurl;
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
    let bookmarks = localStorage.getItem('bookmarks');
    if (bookmarks) {
      this.bookmarks = JSON.parse(bookmarks);
      this.saveState();
    }
  }

  addBookmark(cursor) {
    let oldCursor = [];
    let newCursor = [];
    let bookmark = null;
    let tmpbookmarks = [];
    let newBookmark = null;
    if (cursor === undefined || cursor === null) {
      newCursor = this.bookmarks.length.toString();
      tmpbookmarks = this.bookmarks;
    } else {
      oldCursor = cursor.toString().split(".");
      if (oldCursor.length > 0) {
        tmpbookmarks = this.bookmarks;
        bookmark = tmpbookmarks[oldCursor[0]];
        newCursor.push(oldCursor[0]);
      }
      for (let i = 1; i < oldCursor.length; i++) {
        tmpbookmarks = bookmark.children;
        bookmark = tmpbookmarks[oldCursor[i]];
        newCursor.push(oldCursor[i]);
      }
      if (bookmark.children === undefined || bookmark.children === null) {
        bookmark.children = [];
      }
      tmpbookmarks = bookmark.children;
      newCursor.push((bookmark.children.length).toString());
      newCursor = newCursor.concat().join('.');
    }
    newBookmark = {
      type: 'bookmark',
      title: this.i18n.text['text_example_title'] + newCursor,
      url: this.i18n.text['text_example_url'],
      visible: 1
    };
    tmpbookmarks.push(newBookmark);
    this.saveBookmarks();
    this.editBookmark(newCursor);
  }

  editBookmark(cursor) {
    let oldCursor = cursor.toString().split(".");
    let bookmark = null;
    if (oldCursor.length > 0) {
      bookmark = this.bookmarks[oldCursor[0]];
    }
    for (let i = 1; i < oldCursor.length; i++) {
      bookmark = bookmark.children[oldCursor[i]];
    }
    this.cursor = cursor;
    this.tmptype = bookmark.type;
    this.tmptitle = bookmark.title;
    this.tmpurl = bookmark.url;
    this.saveState();
    const dialog = new MDCDialog(this.bookmarksListRef.current.querySelector('#editbookmark'));
    dialog.open();
  }

  swapBookmarks(a, b) {
    let tmpbookmark = {};
    tmpbookmark.type = a.type;
    tmpbookmark.title = a.title;
    tmpbookmark.url = a.url;
    tmpbookmark.visible = a.visible;
    tmpbookmark.children = a.children;
    a.type = b.type;
    a.title = b.title;
    a.url = b.url;
    if (b.visible === 0) {
      a.visible = 0;
    } else {
      a.visible = b.visible + 1;
    }
    a.children = b.children;
    b.type = tmpbookmark.type;
    b.title = tmpbookmark.title;
    b.url = tmpbookmark.url;
    if (tmpbookmark.visible === 0) {
      b.visible = 0;
    } else {
      b.visible = tmpbookmark.visible + 1;
    }
    b.children = tmpbookmark.children;
  }

  movebackwardBookmark(cursor) {
    let oldCursor = cursor.toString().split(".");
    let bookmark = null;
    let otherbookmark = null;
    let i = 0;
    let tmpIntCusor = 0;
    let tmpParent = {};
    if (oldCursor.length > 0) {
      bookmark = this.bookmarks[oldCursor[0]];
      if (oldCursor.length === 1) {
        tmpIntCusor = parseInt(oldCursor[0]);
        for (let otherID = tmpIntCusor - 1; otherID >= 0 && otherID < this.bookmarks.length; otherID--) {
          if (this.bookmarks[otherID].visible !== 0) {
            otherbookmark = this.bookmarks[otherID];
            break;
          }
        }
      } else {
        for (i = 1; i < oldCursor.length; i++) {
          tmpParent = bookmark;
          bookmark = bookmark.children[oldCursor[i]];
        }
        i--;
        tmpIntCusor = parseInt(oldCursor[i]);
        for (let otherID = tmpIntCusor - 1; otherID >= 0 && otherID < tmpParent.children.length; otherID--) {
          if (tmpParent.children[otherID].visible !== 0) {
            otherbookmark = tmpParent.children[otherID];
            break;
          }
        }
      }
      if (otherbookmark !== null) {
        this.swapBookmarks(bookmark, otherbookmark);
        this.saveBookmarks();
      }
    }
  }

  moveforwardBookmark(cursor) {
    let oldCursor = cursor.toString().split(".");
    let bookmark = null;
    let otherbookmark = null;
    let i = 0;
    let tmpIntCusor = 0;
    let tmpParent = {};
    if (oldCursor.length > 0) {
      bookmark = this.bookmarks[oldCursor[0]];
      if (oldCursor.length === 1) {
        tmpIntCusor = parseInt(oldCursor[0]);
        for (let otherID = tmpIntCusor + 1; otherID >= 0 && otherID < this.bookmarks.length; otherID++) {
          if (this.bookmarks[otherID].visible !== 0) {
            otherbookmark = this.bookmarks[otherID];
            break;
          }
        }
      } else {
        for (i = 1; i < oldCursor.length; i++) {
          tmpParent = bookmark;
          bookmark = bookmark.children[oldCursor[i]];
        }
        i--;
        tmpIntCusor = parseInt(oldCursor[i]);
        for (let otherID = tmpIntCusor + 1; otherID >= 0 && otherID < tmpParent.children.length; otherID++) {
          if (tmpParent.children[otherID].visible !== 0) {
            otherbookmark = tmpParent.children[otherID];
            break;
          }
        }
      }
      if (otherbookmark !== null) {
        this.swapBookmarks(bookmark, otherbookmark);
        this.saveBookmarks();
      }
    }
  }

  moveupwardBookmark(cursor) {
    let oldCursor = cursor.toString().split(".");
    let bookmark = null;
    let otherbookmark = null;
    let i = 0;
    let tmpParent = {};
    let tmpParentParent = {};
    let newBookmark = {
      type: 'bookmark',
      title: "InvisibleElement",
      url: "https://example.example",
      visible: 0
    };

    if (oldCursor.length > 2) {
      // I find the bookmark, the parent, and the parent's parent.
      bookmark = this.bookmarks[oldCursor[0]];
      for (i = 1; i < oldCursor.length; i++) {
        tmpParentParent = tmpParent;
        tmpParent = bookmark;
        bookmark = bookmark.children[oldCursor[i]];
      }

      // I add a new element to the parent's parent "children" array.
      tmpParentParent.children.push(newBookmark);

      // I swap the new element with the selected element.
      otherbookmark = tmpParentParent.children[tmpParentParent.children.length - 1];
      if (otherbookmark !== null) {
        this.swapBookmarks(bookmark, otherbookmark);
        this.saveBookmarks();
      }
    } else if (oldCursor.length > 1) {
      // I find the bookmark, I already know the parent's parent (it's this.bookmarks).
      bookmark = this.bookmarks[oldCursor[0]];
      for (i = 1; i < oldCursor.length; i++) {
        bookmark = bookmark.children[oldCursor[i]];
      }

      // I add a new element to the parent's parent "children" array.
      this.bookmarks.push(newBookmark);

      // I swap the new element with the selected element.
      otherbookmark = this.bookmarks[this.bookmarks.length - 1];
      if (otherbookmark !== null) {
        this.swapBookmarks(bookmark, otherbookmark);
        this.saveBookmarks();
      }
    }
  }

  movedownwardBookmark(cursor) {
    let oldCursor = cursor.toString().split(".");
    let bookmark = null;
    let otherbookmark = null;
    let nextfolder = null;
    let i = 0;
    let tmpIntCusor = 0;
    let tmpParent = {};
    let newBookmark = {
      type: 'bookmark',
      title: "InvisibleElement",
      url: "https://example.example",
      visible: 0
    };

    if (oldCursor.length > 0) {
      // I find the element and the next folder element.
      bookmark = this.bookmarks[oldCursor[0]];
      if (oldCursor.length === 1) {
        tmpIntCusor = parseInt(oldCursor[0]);
        for (let otherID = tmpIntCusor + 1; otherID >= 0 && otherID < this.bookmarks.length; otherID++) {
          if (this.bookmarks[otherID].visible !== 0 && this.bookmarks[otherID].type === 'folder') {
            nextfolder = this.bookmarks[otherID];
            break;
          }
        }
      } else {
        for (i = 1; i < oldCursor.length; i++) {
          tmpParent = bookmark;
          bookmark = bookmark.children[oldCursor[i]];
        }
        i--;
        tmpIntCusor = parseInt(oldCursor[i]);
        for (let otherID = tmpIntCusor + 1; otherID >= 0 && otherID < tmpParent.children.length; otherID++) {
          if (tmpParent.children[otherID].visible !== 0 && tmpParent.children[otherID].type === 'folder') {
            nextfolder = tmpParent.children[otherID];
            break;
          }
        }
      }
      if (nextfolder !== null) {
        // I add a new element to the next folder "children" array.
        if (nextfolder.children === undefined) {
          nextfolder.children = [];
        }
        nextfolder.children.push(newBookmark);

        // I swap the new element with the selected element.
        otherbookmark = nextfolder.children[nextfolder.children.length - 1];
        this.swapBookmarks(bookmark, otherbookmark);
        this.saveBookmarks();
      }
    }
  }

  deleteBookmark(cursor) {
    let oldCursor = cursor.toString().split(".");
    let bookmark = null;
    if (oldCursor.length > 0) {
      bookmark = this.bookmarks[oldCursor[0]];
      for (let i = 1; i < oldCursor.length; i++) {
        bookmark = bookmark.children[oldCursor[i]];
      }
      bookmark.visible = 0;
      this.saveBookmarks();
      this.forceUpdate();
    }
  }

  importBookmarksReaderOnload(e) {
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
      this.saveBookmarks();
      this.forceUpdate();
    }
  }

  importBookmarks(e) {
    let file = e.target.files[0];
    if (!file) {
      if (e.target.files.length > 0) {
        alert(this.i18n.text['text_error_loadfile']);
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
            text_open={this.state.text_open}
            text_add={this.state.text_add}
            text_edit={this.state.text_edit}
            text_move_backward={this.state.text_move_backward}
            text_move_forward={this.state.text_move_forward}
            text_move_upward={this.state.text_move_upward}
            text_move_downward={this.state.text_move_downward}
          />);
      }
    }
    return (
      <div ref={this.bookmarksListRef} lang={this.state.language}>
        <TopAppBar>
          <TopAppBarRow>
            <TopAppBarSection align='start'>
              <TopAppBarTitle>{this.state.text_appname}</TopAppBarTitle>
            </TopAppBarSection>
            <TopAppBarSection align='end' role='toolbar'>
              <TopAppBarIcon actionItem tabIndex={0}>
                <MaterialIcon
                  aria-label={this.state.text_add_label}
                  hasRipple
                  icon='add'
                  onClick={() => this.addBookmark()}
                />
              </TopAppBarIcon>
              <TopAppBarIcon actionItem tabIndex={0}>
                <MaterialIcon
                  aria-label={this.state.text_settings_label}
                  hasRipple
                  icon='settings'
                  onClick={() => this.Settings()}
                />
              </TopAppBarIcon>
              <TopAppBarIcon actionItem tabIndex={0}>
                <MaterialIcon
                  aria-label={this.state.text_importexport_label}
                  hasRipple
                  icon='import_export'
                  onClick={() => this.importExportBookmarks()}
                />
              </TopAppBarIcon>
              <TopAppBarIcon actionItem tabIndex={0}>
                <MaterialIcon
                  aria-label={this.state.text_help_label}
                  hasRipple
                  icon='help'
                  onClick={() => this.help()}
                />
              </TopAppBarIcon>
              <TopAppBarIcon actionItem tabIndex={0}>
                <MaterialIcon
                  aria-label={this.state.text_about_label}
                  hasRipple
                  icon='info'
                  onClick={() => this.about()}
                />
              </TopAppBarIcon>
            </TopAppBarSection>
          </TopAppBarRow>
        </TopAppBar>
        <TopAppBarFixedAdjust>

          <section className="bookmarksSection">
            {bookmarksRepresentation}
          </section>

          <div className="mdc-dialog" role="alertdialog" aria-modal="true" aria-labelledby="my-dialog-title" aria-describedby="my-dialog-content" id="editbookmark">
            <div className="mdc-dialog__container">
              <div className="mdc-dialog__surface">
                <h2 className="mdc-dialog__title" id="editbookmark-dialog-title">{this.state.text_edit_title}</h2>
                <div className="mdc-dialog__content" id="editbookmark-dialog-content">

                  <label>{this.state.text_edit_type}
                    <input type="radio"
                      id="abktypebookmark"
                      name="tmptype"
                      value="bookmark"
                      checked={this.state.tmptype === 'bookmark'}
                      onChange={this.handleInputChange}>
                    </input>{this.state.text_edit_bookmark}
                    <input type="radio"
                      id="abktypefolder"
                      name="tmptype"
                      value="folder"
                      checked={this.state.tmptype === 'folder'}
                      onChange={this.handleInputChange}>
                    </input>{this.state.text_edit_folder}
                  </label><br />
                  <label>{this.state.text_edit_bookmark_title}
                    <input type="text"
                      id="abktitle"
                      name="tmptitle"
                      value={this.state.tmptitle}
                      onChange={this.handleInputChange}>
                    </input>
                  </label><br />
                  {this.state.tmptype === 'bookmark' &&
                    <label>{this.state.text_edit_url}
                      <input type="text"
                        id="abkurl"
                        name="tmpurl"
                        value={this.state.tmpurl}
                        onChange={this.handleInputChange}>
                      </input>
                    </label>
                  }
                </div>
                <footer className="mdc-dialog__actions">
                  <input type="submit" value={this.state.text_delete} onClick={event => this.deleteBookmark(this.state.cursor)} className="mdc-button mdc-dialog__button" data-mdc-dialog-action="yes" />
                  <input type="submit" value={this.state.text_back} className="mdc-button mdc-dialog__button" data-mdc-dialog-action="yes" />
                  <input type="submit" value={this.state.text_save} onClick={event => this.handleSubmit(this.state.cursor)} className="mdc-button mdc-dialog__button" data-mdc-dialog-action="yes" />
                </footer>
              </div>
            </div>
          </div>

          <div className="mdc-dialog" role="alertdialog" aria-modal="true" aria-labelledby="my-dialog-title" aria-describedby="my-dialog-content" id="settings">
            <div className="mdc-dialog__container">
              <div className="mdc-dialog__surface">
                <h2 className="mdc-dialog__title" id="settings-dialog-title">{this.state.text_settings_title}</h2>
                <div className="mdc-dialog__content" id="settings-dialog-content">
                  <p>{this.state.text_settings_content1}</p>
                  <label>{this.state.text_settings_showedit}
                    <input type="radio"
                      id="showedityes"
                      name="showedit"
                      value="yes"
                      checked={this.state.showedit === 'yes'}
                      onChange={this.handleSettingsChange}>
                    </input>{this.state.text_yes}
                    <input type="radio"
                      id="showeditno"
                      name="showedit"
                      value="no"
                      checked={this.state.showedit === 'no'}
                      onChange={this.handleSettingsChange}>
                    </input>{this.state.text_no}
                  </label><br />

                  <label>{this.state.text_settings_showmove}
                    <input type="radio"
                      id="showmoveyes"
                      name="showmove"
                      value="yes"
                      checked={this.state.showmove === 'yes'}
                      onChange={this.handleSettingsChange}>
                    </input>{this.state.text_yes}
                    <input type="radio"
                      id="showmoveno"
                      name="showmove"
                      value="no"
                      checked={this.state.showmove === 'no'}
                      onChange={this.handleSettingsChange}>
                    </input>{this.state.text_no}
                  </label><br />

                  <label>{this.state.text_settings_showadd}
                    <input type="radio"
                      id="showaddyes"
                      name="showadd"
                      value="yes"
                      checked={this.state.showadd === 'yes'}
                      onChange={this.handleSettingsChange}>
                    </input>{this.state.text_yes}
                    <input type="radio"
                      id="showaddno"
                      name="showadd"
                      value="no"
                      checked={this.state.showadd === 'no'}
                      onChange={this.handleSettingsChange}>
                    </input>{this.state.text_no}
                  </label><br />
                  <LanguageSelector text_language={this.state.text_language} language={this.state.language} handleSettingsChange={this.handleSettingsChange} />
                </div>
                <footer className="mdc-dialog__actions">
                  <button type="button" className="mdc-button mdc-dialog__button" data-mdc-dialog-action="yes">
                    <span className="mdc-button__label">{this.state.text_close_button}</span>
                  </button>
                </footer>
              </div>
            </div>
          </div>

          <div className="mdc-dialog" role="alertdialog" aria-modal="true" aria-labelledby="my-dialog-title" aria-describedby="my-dialog-content" id="impexp">
            <div className="mdc-dialog__container">
              <div className="mdc-dialog__surface">
                <h2 className="mdc-dialog__title" id="impexp-dialog-title">{this.state.text_importexport_title}</h2>
                <div className="mdc-dialog__content" id="impexp-dialog-content">
                  <p>{this.state.text_importexport_content}</p>
                </div>
                <footer className="mdc-dialog__actions">
                  <label>{this.state.text_import}&nbsp;<input type="file" onChange={e => this.importBookmarks(e)} className="mdc-button mdc-dialog__button" data-mdc-dialog-action="yes" /></label>
                  <input type="submit" value={this.state.text_back} className="mdc-button mdc-dialog__button" data-mdc-dialog-action="yes" />
                  <input type="submit" value={this.state.text_export} onClick={event => this.exportBookmarks()} className="mdc-button mdc-dialog__button" data-mdc-dialog-action="yes" />
                </footer>
              </div>
            </div>
          </div>

          <div className="mdc-dialog" role="alertdialog" aria-modal="true" aria-labelledby="my-dialog-title" aria-describedby="my-dialog-content" id="help">
            <div className="mdc-dialog__container">
              <div className="mdc-dialog__surface">
                <h2 className="mdc-dialog__title" id="help-dialog-title">{this.state.text_help_title}</h2>
                <div className="mdc-dialog__content" id="help-dialog-content">
                <p>{(this.state.text_help_content1)}</p>
                <p>{(this.state.text_help_content2)}</p>
                <p>{(this.state.text_help_content3)}</p>
                <p>{(this.state.text_help_content4)}</p>
                <p>{(this.state.text_help_content5)}</p>
                <p>{(this.state.text_help_content6)}</p>
                <p>{(this.state.text_help_content7)}</p>
                <p>{(this.state.text_help_content8)}</p>
                </div>
                <footer className="mdc-dialog__actions">
                  <button type="button" className="mdc-button mdc-dialog__button" data-mdc-dialog-action="yes">
                    <span className="mdc-button__label">{this.state.text_close_button}</span>
                  </button>
                </footer>
              </div>
            </div>
            <div className="mdc-dialog__scrim"></div>
          </div>


          <div className="mdc-dialog" role="alertdialog" aria-modal="true" aria-labelledby="my-dialog-title" aria-describedby="my-dialog-content" id="about">
            <div className="mdc-dialog__container">
              <div className="mdc-dialog__surface">
                <h2 className="mdc-dialog__title" id="about-dialog-title">{this.state.text_about_title}</h2>
                <div className="mdc-dialog__content" id="about-dialog-content">
                  <p>{this.state.text_about_content1}
                      <br />{this.state.text_about_content2}</p>
                  <p>{this.state.text_about_content3}</p>
                  <p>{this.state.text_about_content4}</p>
                  <p>{this.state.text_about_content5}</p>
                  <p>{this.state.text_about_content6}</p>
                </div>
                <footer className="mdc-dialog__actions">
                  <button type="button" className="mdc-button mdc-dialog__button" data-mdc-dialog-action="yes">
                    <span className="mdc-button__label">{this.state.text_close_button}</span>
                  </button>
                </footer>
              </div>
            </div>
            <div className="mdc-dialog__scrim"></div>
          </div>

        </TopAppBarFixedAdjust>
      </div>
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
