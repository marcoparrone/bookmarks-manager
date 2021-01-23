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

import parse from 'bookmarks-parser';

import saveAs from 'file-saver';

import HtmlParse from 'html-react-parser';

import get_timestamp from './timestamp';

const supported_languages = ['en', 'af', 'sq', 'am', 'ar', 'hy', 'az', 'eu', 'be', 'bn', 'bs', 'bg', 'ca', 'ceb', 'ny', 'zh-CN', 'zh-TW', 'co', 'hr', 'cs', 'da', 'nl', 'eo', 'et', 'tl', 'fi', 'fr', 'fy', 'gl', 'ka', 'de', 'el', 'gu', 'ht', 'ha', 'haw', 'iw', 'hi', 'hmn', 'hu', 'is', 'ig', 'id', 'ga', 'it', 'ja', 'jw', 'kn', 'kk', 'km', 'rw', 'ko', 'ku', 'ky', 'lo', 'la', 'lv', 'lt', 'lb', 'mk', 'mg', 'ms', 'ml', 'mt', 'mi', 'mr', 'mn', 'my', 'ne', 'no', 'or', 'ps', 'fa', 'pl', 'pt', 'pa', 'ro', 'ru', 'sm', 'gd', 'sr', 'st', 'sn', 'sd', 'si', 'sk', 'sl', 'so', 'es', 'su', 'sw', 'sv', 'tg', 'ta', 'tt', 'te', 'th', 'tr', 'tk', 'uk', 'ur', 'ug', 'uz', 'vi', 'cy', 'xh', 'yi', 'yo', 'zu', 'he', 'zh'];

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
    this.language = 'en';
    this.text =  {
      "text_appname": "Bookmarks",
      "text_add_label": "add a bookmark",
      "text_settings_label": "settings",
      "text_importexport_label": "import and export bookmarks",
      "text_help_label": "help",
      "text_about_label": "about",
      "text_edit_title": "Edit bookmark",
      "text_edit_type": "Type:",
      "text_edit_bookmark": "bookmark",
      "text_edit_folder": "folder",
      "text_edit_bookmark_title": "Title:",
      "text_edit_url": "URL:",
      "text_delete": "Delete",
      "text_back": "Back",
      "text_save": "Save",
      "text_settings_title": "Settings",
      "text_settings_content1": "Here you can configure the application.",
      "text_yes": "yes",
      "text_no": "no",
      "text_settings_showedit": "Show edit buttons:",
      "text_settings_showmove": "Show movement buttons:",
      "text_settings_showadd": "Show \"add\" buttons in folders:",
      "text_language": "Choose language:",
      "text_close_button": "Close",
      "text_importexport_title": "Import/export",
      "text_importexport_content": "Here you can import and export your bookmarks in Netscape format.",
      "text_import": "Import:",
      "text_export": "Export",
      "text_error_loadfile": "error: cannot load file.",
      "text_error_loadingfile": "error loading file: ",
      "text_example_title": "Example Title",
      "text_example_url": "https://example.example",
      "text_open": "Open",
      "text_add": "Add",
      "text_edit": "Edit",
      "text_move_backward": "Move Backward",
      "text_move_forward": "Move Forward",
      "text_move_upward": "Move Upward",
      "text_move_downward": "Move Downward",
      "text_help_title": "Help",
      "text_about_title": "About",
      "text_help_content": "<p>Bookmarks Manager is an application that helps to save and edit internet bookmarks.</p> <p>To create a new bookmark, or a new folder, press the \"plus\" icon: choose between bookmark and folder, insert the title and eventually the URL, then press save to save the changes, or press delete to delete the bookmark, or back to skip the changes but keep the bookmark.</p> <p>Press the \"open\" button near a bookmark to open the related URL.</p> <p>Press the \"add\" button inside a folder to add a new element to it.</p> <p>For both bookmarks and folders, press the \"edit\" button to modify them, press the \"move backward\" button to exchange the position with the previous element, press the \"move forward\" button to exchange the position with the next element, press the \"move upward\" button to move the element out of the folder where it currently is, or press the \"move downward\" button to move the element inside the next subfolder.  </p> <p>In the settings menu, accessible after clicking on the \"settings\" icon, you can hide or show the editing, movement and addition buttons. It is also possible to change the language of the user interface.</p> <p>To import or export the bookmarks, press on the import/export icon. The HTML Netscape Bookmarks format is supported, so it is possible to import the bookmarks exported by the major web browsers. When importing the bookmarks from a file, the current bookmarks will be deleted and overwritten.</p> <p>Bookmarks Manager is a Progressive Web Application, which means that it runs inside a browser. When you install it, while the browser components are not shown, it still runs inside a browser. The bookmarks are saved in the browser’s localStorage for the bookmarks.marcoparrone.com domain. localStorage works fine with Chrome, Edge and Firefox browsers. Other browsers may delete localStorage after some time. Android by default uses Chrome, Windows by default uses Edge. Bookmarks Manager currently is not supported on Apple products. With the purpose to help to prevent the loss of the bookmarks, it is suggested to make a backup using the \"export\" functionality, every time you make some modifications that you don't want to lose.</p>",
      "text_about_content1": "<p>Copyright © 2017,2019,2020,2021 Marco Parrone.<br />All Rights Reserved.</p><p>THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.</p>",
      "text_about_content2": "<p>THIS SERVICE MAY CONTAIN TRANSLATIONS POWERED BY GOOGLE. GOOGLE DISCLAIMS ALL WARRANTIES RELATED TO THE TRANSLATIONS, EXPRESS OR IMPLIED, INCLUDING ANY WARRANTIES OF ACCURACY, RELIABILITY, AND ANY IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.</p>",
      "text_about_content3": "<p>This web app has been translated for your convenience using translation software powered by Google Translate. Reasonable efforts have been made to provide an accurate translation, however, no automated translation is perfect nor is it intended to replace human translators. Translations are provided as a service to users of the marcoparrone.com website, and are provided \"as is.\" No warranty of any kind, either expressed or implied, is made as to the accuracy, reliability, or correctness of any translations made from English into any other language. Some content (such as images, videos, Flash, etc.) may not be accurately translated due to the limitations of the translation software.</p><p>The official text is the English version of the website. Any discrepancies or differences created in the translation are not binding and have no legal effect for compliance or enforcement purposes. If any questions arise related to the accuracy of the information contained in the translated website, refer to the English version of the website which is the official version.</p>"
  };

    this.state = {
      bookmarks: this.bookmarks,
      cursor: this.cursor,
      tmptype: this.tmptype,
      tmptitle: this.tmptitle,
      tmpurl: this.tmpurl,
      showedit: this.showedit,
      showmove: this.showmove,
      showadd: this.showadd,
      language: this.language,
      text_appname: this.text['text_appname'],
      text_add_label: this.text['text_add_label'],
      text_settings_label: this.text['text_settings_label'],
      text_importexport_label: this.text['text_importexport_label'],
      text_help_label: this.text['text_help_label'],
      text_about_label: this.text['text_about_label'],
      text_edit_title: this.text['text_edit_title'],
      text_edit_type: this.text['text_edit_type'],
      text_edit_bookmark: this.text['text_edit_bookmark'],
      text_edit_folder: this.text['text_edit_folder'],
      text_edit_bookmark_title: this.text['text_edit_bookmark_title'],
      text_edit_url: this.text['text_edit_url'],
      text_delete: this.text['text_delete'],
      text_back: this.text['text_back'],
      text_save: this.text['text_save'],
      text_settings_title: this.text['text_settings_title'],
      text_settings_content1: this.text['text_settings_content1'],
      text_yes: this.text['text_yes'],
      text_no: this.text['text_no'],
      text_settings_showedit: this.text['text_settings_showedit'],
      text_settings_showmove: this.text['text_settings_showmove'],
      text_settings_showadd: this.text['text_settings_showadd'],
      text_language: this.text['text_language'],
      text_close_button: this.text['text_close_button'],
      text_importexport_title: this.text['text_importexport_title'],
      text_importexport_content: this.text['text_importexport_content'],
      text_import: this.text['text_import'],
      text_export: this.text['text_export'],
      text_error_loadfile: this.text['text_error_loadfile'],
      text_error_loadingfile: this.text['text_error_loadingfile'],
      text_example_title: this.text['text_example_title'],
      text_example_url: this.text['text_example_url'],
      text_open: this.text['text_open'],
      text_add: this.text['text_add'],
      text_edit: this.text['text_edit'],
      text_move_backward: this.text['text_move_backward'],
      text_move_forward: this.text['text_move_forward'],
      text_move_upward: this.text['text_move_upward'],
      text_move_downward: this.text['text_move_downward'],
      text_help_title: this.text['text_help_title'],
      text_about_title: this.text['text_about_title'],
      text_help_content: this.text['text_help_content'],
      text_about_content1: this.text['text_about_content1'],
      text_about_content2: this.text['text_about_content2'],
      text_about_content3: this.text['text_about_content3']
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
    this.i18n_init = this.i18n_init.bind(this);
    this.saveState = this.saveState.bind(this);
    this.bookmarksListRef = React.createRef();
  }

  saveState () {
    this.setState({
      bookmarks: this.bookmarks,
      cursor: this.cursor,
      tmptype: this.tmptype,
      tmptitle: this.tmptitle,
      tmpurl: this.tmpurl,
      showedit: this.showedit,
      showmove: this.showmove,
      showadd: this.showadd,
      language: this.language,
      text_appname: this.text['text_appname'],
      text_add_label: this.text['text_add_label'],
      text_settings_label: this.text['text_settings_label'],
      text_importexport_label: this.text['text_importexport_label'],
      text_help_label: this.text['text_help_label'],
      text_about_label: this.text['text_about_label'],
      text_edit_title: this.text['text_edit_title'],
      text_edit_type: this.text['text_edit_type'],
      text_edit_bookmark: this.text['text_edit_bookmark'],
      text_edit_folder: this.text['text_edit_folder'],
      text_edit_bookmark_title: this.text['text_edit_bookmark_title'],
      text_edit_url: this.text['text_edit_url'],
      text_delete: this.text['text_delete'],
      text_back: this.text['text_back'],
      text_save: this.text['text_save'],
      text_settings_title: this.text['text_settings_title'],
      text_settings_content1: this.text['text_settings_content1'],
      text_yes: this.text['text_yes'],
      text_no: this.text['text_no'],
      text_settings_showedit: this.text['text_settings_showedit'],
      text_settings_showmove: this.text['text_settings_showmove'],
      text_settings_showadd: this.text['text_settings_showadd'],
      text_language: this.text['text_language'],
      text_close_button: this.text['text_close_button'],
      text_importexport_title: this.text['text_importexport_title'],
      text_importexport_content: this.text['text_importexport_content'],
      text_import: this.text['text_import'],
      text_export: this.text['text_export'],
      text_error_loadfile: this.text['text_error_loadfile'],
      text_error_loadingfile: this.text['text_error_loadingfile'],
      text_example_title: this.text['text_example_title'],
      text_example_url: this.text['text_example_url'],
      text_open: this.text['text_open'],
      text_add: this.text['text_add'],
      text_edit: this.text['text_edit'],
      text_move_backward: this.text['text_move_backward'],
      text_move_forward: this.text['text_move_forward'],
      text_move_upward: this.text['text_move_upward'],
      text_move_downward: this.text['text_move_downward'],
      text_help_title: this.text['text_help_title'],
      text_about_title: this.text['text_about_title'],
      text_help_content: this.text['text_help_content'],
      text_about_content1: this.text['text_about_content1'],
      text_about_content2: this.text['text_about_content2'],
      text_about_content3: this.text['text_about_content3']
    });
  }

  i18n_init() {
    fetch('i18n/' + this.language + '.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        } else {
          return response.json();
        }
      })
      .then((messages) => {
        this.text = messages;
        this.saveState();
        localStorage.setItem('language', this.language);
      })
      .catch(error => {
        console.error('Cannot fetch i18n/' + this.language + '.json: ', error);
      });
  }

  componentDidMount() {
    let showedit = localStorage.getItem('bookmarks_showedit');
    let showmove = localStorage.getItem('bookmarks_showmove');
    let showadd = localStorage.getItem('bookmarks_showadd');
    let language = localStorage.getItem('language');
    
    if (showedit === 'yes' || showedit === 'no') {
      this.showedit = showedit;
    }
    if (showmove === 'yes' || showmove === 'no') {
      this.showmove = showmove;
    }
    if (showadd === 'yes' || showadd === 'no') {
      this.showadd = showadd;
    }

    if (supported_languages.includes(language)) {
      this.language = language;
    } else {
        if (navigator && navigator.languages) {
            this.language = navigator.languages.find(lang => {return supported_languages.includes(lang)});
            if (! this.language) {
                this.language = 'en';
            }
        }
    }
    
    // Localize the User Interface.
    this.i18n_init();

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
        if (supported_languages.includes(e.target.value)) {
          this.language = e.target.value;
          this.i18n_init();
        }
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
      title: this.text['text_example_title'] + newCursor,
      url: this.text['text_example_url'],
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
    let text_error_loadingfile = this.text['text_error_loadingfile'];
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
        alert(this.text['text_error_loadfile']);
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
                  <label htmlFor="lang">{this.state.text_language}</label>

                  <select id="lang" name="lang" lang="en" value={this.state.language} onChange={this.handleSettingsChange}>
                  <option value="af">Afrikaans</option>
                  <option value="sq">Albanian</option>
                  <option value="am">Amharic</option>
                  <option value="ar">Arabic</option>
                  <option value="hy">Armenian</option>
                  <option value="az">Azerbaijani</option>
                  <option value="eu">Basque</option>
                  <option value="be">Belarusian</option>
                  <option value="bn">Bengali</option>
                  <option value="bs">Bosnian</option>
                  <option value="bg">Bulgarian</option>
                  <option value="ca">Catalan</option>
                  <option value="ceb">Cebuano</option>
                  <option value="ny">Chichewa</option>
                  <option value="zh-CN">Chinese (Simplified)</option>
                  <option value="zh-TW">Chinese (Traditional)</option>
                  <option value="zh">Chinese (Simplified)</option>
                  <option value="co">Corsican</option>
                  <option value="hr">Croatian</option>
                  <option value="cs">Czech</option>
                  <option value="da">Danish</option>
                  <option value="nl">Dutch</option>
                  <option value="en">English</option>
                  <option value="eo">Esperanto</option>
                  <option value="et">Estonian</option>
                  <option value="tl">Filipino</option>
                  <option value="fi">Finnish</option>
                  <option value="fr">French</option>
                  <option value="fy">Frisian</option>
                  <option value="gl">Galician</option>
                  <option value="ka">Georgian</option>
                  <option value="de">German</option>
                  <option value="el">Greek</option>
                  <option value="gu">Gujarati</option>
                  <option value="ht">Haitian Creole</option>
                  <option value="ha">Hausa</option>
                  <option value="haw">Hawaiian</option>
                  <option value="iw">Hebrew</option>
                  <option value="he">Hebrew</option>
                  <option value="hi">Hindi</option>
                  <option value="hmn">Hmong</option>
                  <option value="hu">Hungarian</option>
                  <option value="is">Icelandic</option>
                  <option value="ig">Igbo</option>
                  <option value="id">Indonesian</option>
                  <option value="ga">Irish</option>
                  <option value="it">Italian</option>
                  <option value="ja">Japanese</option>
                  <option value="jw">Javanese</option>
                  <option value="kn">Kannada</option>
                  <option value="kk">Kazakh</option>
                  <option value="km">Khmer</option>
                  <option value="rw">Kinyarwanda</option>
                  <option value="ko">Korean</option>
                  <option value="ku">Kurdish (Kurmanji)</option>
                  <option value="ky">Kyrgyz</option>
                  <option value="lo">Lao</option>
                  <option value="la">Latin</option>
                  <option value="lv">Latvian</option>
                  <option value="lt">Lithuanian</option>
                  <option value="lb">Luxembourgish</option>
                  <option value="mk">Macedonian</option>
                  <option value="mg">Malagasy</option>
                  <option value="ms">Malay</option>
                  <option value="ml">Malayalam</option>
                  <option value="mt">Maltese</option>
                  <option value="mi">Maori</option>
                  <option value="mr">Marathi</option>
                  <option value="mn">Mongolian</option>
                  <option value="my">Myanmar (Burmese)</option>
                  <option value="ne">Nepali</option>
                  <option value="no">Norwegian</option>
                  <option value="or">Odia (Oriya)</option>
                  <option value="ps">Pashto</option>
                  <option value="fa">Persian</option>
                  <option value="pl">Polish</option>
                  <option value="pt">Portuguese</option>
                  <option value="pa">Punjabi</option>
                  <option value="ro">Romanian</option>
                  <option value="ru">Russian</option>
                  <option value="sm">Samoan</option>
                  <option value="gd">Scots Gaelic</option>
                  <option value="sr">Serbian</option>
                  <option value="st">Sesotho</option>
                  <option value="sn">Shona</option>
                  <option value="sd">Sindhi</option>
                  <option value="si">Sinhala</option>
                  <option value="sk">Slovak</option>
                  <option value="sl">Slovenian</option>
                  <option value="so">Somali</option>
                  <option value="es">Spanish</option>
                  <option value="su">Sundanese</option>
                  <option value="sw">Swahili</option>
                  <option value="sv">Swedish</option>
                  <option value="tg">Tajik</option>
                  <option value="ta">Tamil</option>
                  <option value="tt">Tatar</option>
                  <option value="te">Telugu</option>
                  <option value="th">Thai</option>
                  <option value="tr">Turkish</option>
                  <option value="tk">Turkmen</option>
                  <option value="uk">Ukrainian</option>
                  <option value="ur">Urdu</option>
                  <option value="ug">Uyghur</option>
                  <option value="uz">Uzbek</option>
                  <option value="vi">Vietnamese</option>
                  <option value="cy">Welsh</option>
                  <option value="xh">Xhosa</option>
                  <option value="yi">Yiddish</option>
                  <option value="yo">Yoruba</option>
                  <option value="zu">Zulu</option>
                  </select>
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
                {HtmlParse(this.state.text_help_content)}
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
                {HtmlParse(this.state.text_about_content1)}
                {HtmlParse(this.state.text_about_content2)}
                {HtmlParse(this.state.text_about_content3)}
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
