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
import {MDCDialog} from '@material/dialog';

import "@material/card/dist/mdc.card.css";

import parse from 'bookmarks-parser';

import saveAs from 'file-saver';

import get_timestamp from './timestamp';

class Bookmark extends React.Component {
    render () {
        let content = [];
        let count = 0;
        let element = null;
        let keyprefix = "Bookmark" + this.props.id;
        if (this.props.type === 'bookmark') {
            content.push (<label key={keyprefix}>{this.props.title}&nbsp;
                            <a href={this.props.url} target="_blank" rel="noreferrer">
                              <button
                                aria-pressed="false"
                                aria-label="Open"
                                title="Open">
                                <i className="material-icons mdc-icon-button__icon">open_in_new</i>
                              </button>
                            </a>
                          </label>);
        } else {
            content.push(<label key={keyprefix + "Label"}>{this.props.title}: </label>);

            content.push(<br key={keyprefix + "Br"}/>);

            if (this.props.children !== undefined && this.props.children !== null && this.props.children !== []) {
                count = this.props.children.length;
                for (let i = 0; i < count; i++) {
                    element = this.props.children[i];
                    if (element.visible !== false) {
                        content.push(<Bookmark
                                       id={this.props.id + "." + i.toString()}
                                       key={keyprefix + "." + i.toString()}
                                       type={element.type}
                                       title={element.title}
                                       url={element.url}
                                       children={element.children}
                                       addBookmark={this.props.addBookmark}                                   
                                       editBookmark={this.props.editBookmark}
                                     />);
                    }
                }
            }

            content.push(<button
                           key={keyprefix + "AddButton"}
                           aria-pressed="false"
                           aria-label="Add"
                           title="Add"
                           onClick={event => this.props.addBookmark(this.props.id)}>
                           <i className="material-icons mdc-icon-button__icon">add</i>
                         </button>);
            
        }
        return (
	    <div className="mdc-card  mdc-card--outlined" key={keyprefix + "Card"}>
              <div className="card-body mdc-typography--body2">{content}&nbsp;
                <button 
                        aria-pressed="false"
                        aria-label="Edit"
                        title="Edit"
                        onClick={event => this.props.editBookmark(this.props.id)}>
                  <i className="material-icons mdc-icon-button__icon">edit</i>
                </button>
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
        this.state = {
            bookmarks: [],
            cursor: -1,
            tmptype: 'bookmark',
            tmptitle: "",
            tmpurl: ""
        };
        this.deleteBookmark = this.deleteBookmark.bind(this);
        this.addBookmark = this.addBookmark.bind(this);
        this.editBookmark = this.editBookmark.bind(this);
        this.about = this.about.bind(this);
        this.help = this.help.bind(this);
        this.importExportBookmarks = this.importExportBookmarks.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.importBookmarksReaderOnload = this.importBookmarksReaderOnload.bind(this);
        this.importBookmarks = this.importBookmarks.bind(this);
        this.exportBookmarks = this.exportBookmarks.bind(this);
        this.bookmarksListRef = React.createRef();
    }

    componentDidMount() {
        this.loadBookmarks();        
    }
    
    componentWillUnmount() {
        
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

    saveBookmarks () {
        let newBookmarks = [];

        // Save in current state.
        this.setState({
            bookmarks: this.state.bookmarks
        });

        // Save in local storage, skipping deleted bookmarks.
        for (let i = 0; i < this.bookmarks.length; i++) {
            if (this.bookmarks[i].visible) {
                newBookmarks.push (this.bookmarks[i]);
            }
        }
        localStorage.setItem('bookmarks', JSON.stringify(newBookmarks));
        
        if (process.env.NODE_ENV === 'development') {
            console.log("--- saveBookmarks:");
            console.log(this.state.bookmarks);
            console.log("--- mid");
            console.log(this.bookmarks);
            console.log("--- at end of saveBookmarks");
        }
    }

    handleSubmit(cursor) {
        let newCursor = cursor.split(".");
        let bookmark = null;
        if (newCursor.length > 0) {
            bookmark = this.bookmarks[newCursor[0]];
        }
        for (let i = 1; i < newCursor.length; i++) {
            bookmark=bookmark.children[newCursor[i]];
        }
        bookmark.title = this.state.tmptitle;
        bookmark.type = this.state.tmptype;
        bookmark.url = this.state.tmpurl;
        this.saveBookmarks ();
        this.forceUpdate();
    }

    handleInputChange(event) {
        const target = event.target;
        const value =
              target.type === 'checkbox'
              ? target.checked
              : target.value;
        const name = target.name;

        this.setState({
            [name]: value,
        });
    }

    loadBookmarks () {
        let bookmarks = localStorage.getItem('bookmarks');
        if (bookmarks) {
            this.bookmarks = JSON.parse(bookmarks);
            this.setState({
                bookmarks: this.bookmarks
            });
        }
    }

    addBookmark(cursor) {
        let oldCursor = [];
        let newCursor = [];
        let bookmark = null;
        let bookmarks = [];
        let newBookmark = null;
        if (cursor === undefined || cursor === null) {
            newCursor = this.bookmarks.length.toString();
            bookmarks = this.bookmarks;
        } else {
            oldCursor = cursor.split(".");
            if (oldCursor.length > 0) {
                bookmarks = this.bookmarks;
                bookmark = bookmarks[oldCursor[0]];
                newCursor.push(oldCursor[0]);
            }
            for (let i = 1; i < oldCursor.length; i++) {
                bookmarks=bookmark.children;
                bookmark=bookmarks[oldCursor[i]];
                newCursor.push(oldCursor[i]);
            }
            if (bookmark.children === undefined || bookmark.childred === null) {
                bookmark.children = [];
            }
            bookmarks = bookmark.children;
            newCursor.push((bookmark.children.length).toString());
            newCursor = newCursor.concat().join('.');
        }
        newBookmark = {
            type: 'bookmark',
	    title: "ExampleTitle" + newCursor,
	    url: "https://example.example",
            visible: true
        };
        bookmarks.push(newBookmark);
        this.saveBookmarks ();
        this.editBookmark(newCursor);
    }

    editBookmark(cursor) {
        let oldCursor = cursor.split(".");
        let bookmark = null;
        if (oldCursor.length > 0) {
            bookmark = this.bookmarks[oldCursor[0]];
        }
        for (let i = 1; i < oldCursor.length; i++) {
            bookmark=bookmark.children[oldCursor[i]];
        }
        this.setState({
            cursor: cursor,
            tmptype: bookmark.type,
            tmptitle: bookmark.title,
            tmpurl: bookmark.url
        });
        const dialog = new MDCDialog(this.bookmarksListRef.current.querySelector('#editbookmark'));
        dialog.open();
    }

    deleteBookmark (cursor) {
        let oldCursor = cursor.split(".");
        let bookmark = null;
        if (oldCursor.length > 0) {
            bookmark = this.bookmarks[oldCursor[0]];
        }
        for (let i = 1; i < oldCursor.length; i++) {
            bookmark=bookmark.children[oldCursor[i]];
        }
        bookmark.visible = false;
        this.forceUpdate();
        this.saveBookmarks ();
    }

    importBookmarksReaderOnload (e) {
        let newBookmarks = [];
        parse(e.target.result,
              function(err, res) {
                  if (err)
                  {
                      alert ('error loading file: ' + err);
                  } else {
                      for (let i = 0; i < res.bookmarks.length; i++) {
                          newBookmarks.push (res.bookmarks[i]);
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
                newBookmarks[i].visible = true;
                this.bookmarks.push(newBookmarks[i]);
            }
            // Save and display.
            this.saveBookmarks ();
            this.forceUpdate();
        }
    }
    
    importBookmarks (e) {
        let file = e.target.files[0];
        if (! file) {
            if (e.target.files.length > 0) {
                alert ('error: cannot load file.');
            }
            return;
        }
        let reader = new FileReader();
        reader.onload = this.importBookmarksReaderOnload;
        reader.readAsText(file);
    }
    
    exportBookmarksHelper (bookmarks) {
        let bookmarksCount = bookmarks.length;
        let netscapeBookmarks = [];
        for (let i = 0; i < bookmarksCount; i++) {
            if (bookmarks[i].visible !== false) {
                if (bookmarks[i].type !== 'bookmark') {
                    if (bookmarks[i].ns_root === 'toolbar'){
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

    exportBookmarks () {
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
        saveAs(new Blob([netscapeBookmarks.join('\n')], {type: "text/plain;charset=utf-8"}),
               'bookmarks-' + get_timestamp() + '.html');
    }

    render () {
        let bookmarksCount = this.bookmarks.length;
        let bookmarksRepresentation = [];
        for (let i = 0; i < bookmarksCount; i++) {
            if (this.bookmarks[i].visible) {
                bookmarksRepresentation.push(
                    <Bookmark
                      id={i.toString()}
                      key={"Bookmark" + i}
                      type={this.bookmarks[i].type}
                      title={this.bookmarks[i].title}
                      url={this.bookmarks[i].url}
                      children={this.bookmarks[i].children}
                      addBookmark={this.addBookmark}
                      editBookmark={this.editBookmark}
                    />);
            }
        }
        return (
	    <div ref={this.bookmarksListRef}>
              <TopAppBar>
                <TopAppBarRow>
                  <TopAppBarSection align='start'>
                    <TopAppBarTitle>Bookmarks Manager</TopAppBarTitle>
                  </TopAppBarSection>
                  <TopAppBarSection align='end' role='toolbar'>
                    <TopAppBarIcon actionItem tabIndex={0}>
                      <MaterialIcon 
                        aria-label="add a bookmark" 
                        hasRipple 
                        icon='add' 
                        onClick={() => this.addBookmark()}
                      />
                    </TopAppBarIcon>
                    <TopAppBarIcon actionItem tabIndex={0}>
                      <MaterialIcon 
                        aria-label="import and export bookmarks" 
                        hasRipple 
                        icon='import_export' 
                        onClick={() => this.importExportBookmarks()}
                      />
                    </TopAppBarIcon>
                    <TopAppBarIcon actionItem tabIndex={0}>
                      <MaterialIcon
                        aria-label="help"
                        hasRipple
                        icon='help'
                        onClick={() => this.help()}
			/>
		    </TopAppBarIcon>
                    <TopAppBarIcon actionItem tabIndex={0}>
                      <MaterialIcon
                        aria-label="about"
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
                      <h2 className="mdc-dialog__title" id="editbookmark-dialog-title">Edit bookmark</h2>
                      <div className="mdc-dialog__content" id="editbookmark-dialog-content">

                        <label>Type:
                          <input type="radio"
                                 id="abktypebookmark"
                                 name="tmptype"
                                 value="bookmark"
                                 checked={this.state.tmptype === 'bookmark'}
                                 onChange={this.handleInputChange}>
                          </input>bookmark
                          <input type="radio"
                                 id="abktypefolder"
                                 name="tmptype"
                                 value="folder"
                                 checked={this.state.tmptype === 'folder'}
                                 onChange={this.handleInputChange}>
                          </input>folder
                        </label><br />
                        <label>Title:
                          <input type="text"
                                 id="abktitle"
                                 name="tmptitle"
                                 value={this.state.tmptitle}
                                 onChange={this.handleInputChange}>
                          </input>
                        </label><br />
                        {this.state.tmptype === 'bookmark' &&
                         <label>URL:
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
                        <input type="submit" value="Delete" onClick={event => this.deleteBookmark(this.state.cursor)} className="mdc-button mdc-dialog__button" data-mdc-dialog-action="yes" />
                        <input type="submit" value="Back" className="mdc-button mdc-dialog__button" data-mdc-dialog-action="yes" />                       
                        <input type="submit" value="Save" onClick={event => this.handleSubmit(this.state.cursor)} className="mdc-button mdc-dialog__button" data-mdc-dialog-action="yes" />
                      </footer>
                    </div>
                  </div>
                </div>

                <div className="mdc-dialog" role="alertdialog" aria-modal="true" aria-labelledby="my-dialog-title" aria-describedby="my-dialog-content" id="impexp">
                  <div className="mdc-dialog__container">
                    <div className="mdc-dialog__surface">
                      <h2 className="mdc-dialog__title" id="impexp-dialog-title">Import/export</h2>
                      <div className="mdc-dialog__content" id="impexp-dialog-content">
                        <p>Here you can import and export your bookmarks in Netscape format.</p>
                      </div>
                      <footer className="mdc-dialog__actions">
                        <label>Import:&nbsp;<input type="file" onChange={e => this.importBookmarks(e)} className="mdc-button mdc-dialog__button" data-mdc-dialog-action="yes" /></label>
                        <input type="submit" value="Back" className="mdc-button mdc-dialog__button" data-mdc-dialog-action="yes" />                       
                        <input type="submit" value="Export" onClick={event => this.exportBookmarks()} className="mdc-button mdc-dialog__button" data-mdc-dialog-action="yes" />
                      </footer>
                    </div>
                  </div>
                </div>

		<div className="mdc-dialog" role="alertdialog" aria-modal="true" aria-labelledby="my-dialog-title" aria-describedby="my-dialog-content" id="help">
                  <div className="mdc-dialog__container">
                    <div className="mdc-dialog__surface">
                      <h2 className="mdc-dialog__title" id="help-dialog-title">Help</h2>
                      <div className="mdc-dialog__content" id="help-dialog-content">
			<p>This is a bookmarks manager.</p>
                        <p>To create a new bookmark, or a new folder, press the "plus" icon: choose between bookmark and folder, insert the title and eventually the URL, then press save to save the changes, or press delete to delete the bookmark, or back to skip the changes but keep the bookmark.</p>
                        <p>Press on the "open" button near a bookmark to open the related URL, or press edit to modify it.</p>
                        <p>To import or export the bookmarks, press on the import/export icon. The HTML Netscape Bookmarks format is supported, so it is possible to import the bookmarks exported by the major web browsers. When importing the bookmarks from a file, the current bookmarks will be deleted and overwritten.</p>
                        <p>For preventing the loss of the bookmarks, it is suggested to make a backup using the "export" functionality.</p>
                      </div>
                      <footer className="mdc-dialog__actions">
                        <button type="button" className="mdc-button mdc-dialog__button" data-mdc-dialog-action="yes">
                          <span className="mdc-button__label">Close</span>
                        </button>
                      </footer>
                    </div>
                  </div>
                  <div className="mdc-dialog__scrim"></div>
                </div>

                
                <div className="mdc-dialog" role="alertdialog" aria-modal="true" aria-labelledby="my-dialog-title" aria-describedby="my-dialog-content" id="about">
                  <div className="mdc-dialog__container">
                    <div className="mdc-dialog__surface">
                      <h2 className="mdc-dialog__title" id="about-dialog-title">About</h2>
                      <div className="mdc-dialog__content" id="about-dialog-content">
                        <p>Copyright &copy; 2019,2020 Marco Parrone</p>
                        <p>Permission is hereby granted, free of charge, to any person obtaining a copy
                          of this software and associated documentation files (the "Software"), to deal
                          in the Software without restriction, including without limitation the rights
                          to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
                          copies of the Software, and to permit persons to whom the Software is
                          furnished to do so, subject to the following conditions:</p>
                        <p>The above copyright notice and this permission notice shall be included in all
                          copies or substantial portions of the Software.</p>
                        <p>THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
                          IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
                          FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
                          AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
                          LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
                          OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
                          SOFTWARE.</p>
                      </div>
                      <footer className="mdc-dialog__actions">
                        <button type="button" className="mdc-button mdc-dialog__button" data-mdc-dialog-action="yes">
                          <span className="mdc-button__label">Close</span>
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
          <BookmarksList/>
        </div>
    );
}

export default App;
