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

class Bookmark extends React.Component {
    constructor(props) {
        super(props);
        this.bookmarkRef = React.createRef();
    }

    render () {
        return (

	    <div className="mdc-card  mdc-card--outlined">
              <div className="card-header">
                <div className="card-title">
                  <h2 className="mdc-typography--headline6">{this.props.title}</h2>
                </div>
                <div className="mdc-card__media mdc-card__media--square">
                  <div className="mdc-card__media-content"></div>
                </div>
              </div>
              <div className="card-body mdc-typography--body2">{this.props.description}</div>
              <div className="mdc-card__actions">
                <div className="mdc-card__action-buttons">
                  <button className="mdc-button mdc-card__action mdc-card__action--button" onClick={event => window.open(this.props.link)}>Open</button>
                  <button className="mdc-button mdc-card__action mdc-card__action--button" onClick={event => this.props.editBookmark(this.props.id)}>Edit</button>
                </div>
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
            tmptitle: "",
            tmplink: "",
            tmpdescription: ""
        };
        this.deleteBookmark = this.deleteBookmark.bind(this);
        this.editBookmark = this.editBookmark.bind(this);
        this.addBookmark = this.addBookmark.bind(this);
        this.about = this.about.bind(this);
        this.addbk = this.addbk.bind(this);
        this.addbk = this.addbk.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        
        this.bookmarksListRef = React.createRef();
    }

    componentDidMount() {
        this.loadBookmarks();        
    }
    
    componentWillUnmount() {
        
    }

    addbk() {
        this.addBookmark();
        this.editBookmark(this.bookmarks.length - 1);
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
        let intCursor = parseInt(cursor);
        this.bookmarks[intCursor].title = this.state.tmptitle;
        this.bookmarks[intCursor].link = this.state.tmplink;
        this.bookmarks[intCursor].description = this.state.tmpdescription;
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

    addBookmark() {
        let last = this.bookmarks.length;
        let newBookmark = {
	    title: "ExampleTitle" + last.toString(),
	    link: "https://example.example",
	    description: "ExampleDescription" + last.toString(),
            visible: true
        };
        this.bookmarks.push(newBookmark);
        this.saveBookmarks ();
    }

    editBookmark(cursor) {
        this.setState({
            cursor: cursor,
            tmptitle: this.bookmarks[cursor].title,
            tmplink: this.bookmarks[cursor].link,
            tmpdescription: this.bookmarks[cursor].description
        });
        const dialog = new MDCDialog(this.bookmarksListRef.current.querySelector('#editbookmark'));
        dialog.open();
    }

    deleteBookmark (id) {
        let intID = parseInt(id);
        this.bookmarks[intID].visible = false;
        this.forceUpdate();
        this.saveBookmarks ();
    }

    render () {
        let bookmarksCount = this.state.bookmarks.length;
        let bookmarksRepresentation = [];
        for (let i = 0; i < bookmarksCount; i++) {
            if (this.bookmarks[i].visible) {
                bookmarksRepresentation.push(
                    <Bookmark
                      id={i.toString()}
                      key={"Bookmark" + i}
                      title={this.state.bookmarks[i].title}
                      link={this.state.bookmarks[i].link}
		      description={this.state.bookmarks[i].description}
                      editBookmark={this.editBookmark}
                      bookmarksListRef={this.bookmarksListRef}
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
                        onClick={() => this.addbk()}
                      />
                    </TopAppBarIcon>
                    <TopAppBarIcon actionItem tabIndex={0}>
                      <MaterialIcon 
                        aria-label="about" 
                        hasRipple 
                        icon='help' 
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
                        <label>Title:
                          <input type="text"
                                 id="abktitle"
                                 name="tmptitle"
                                 value={this.state.tmptitle}
                                 onChange={this.handleInputChange}>
                          </input>
                        </label><br />
                        <label>Link:
                          <input type="text"
                                 id="abklink"
                                 name="tmplink"
                                 value={this.state.tmplink}
                                 onChange={this.handleInputChange}>
                          </input>
                        </label><br />
                        <label>Description:
                          <input type="text"
                                 id="abkdescription"
                                 name="tmpdescription"
                                 value={this.state.tmpdescription}
                                 onChange={this.handleInputChange}>
                          </input>
                        </label>
                      </div>
                      <footer className="mdc-dialog__actions">
                        <input type="submit" value="Delete" onClick={event => this.deleteBookmark(this.state.cursor)} className="mdc-button mdc-dialog__button" data-mdc-dialog-action="yes" />
                        <input type="submit" value="Back" className="mdc-button mdc-dialog__button" data-mdc-dialog-action="yes" />                       
                        <input type="submit" value="Save" onClick={event => this.handleSubmit(this.state.cursor)} className="mdc-button mdc-dialog__button" data-mdc-dialog-action="yes" />
                      </footer>
                    </div>
                  </div>
                  
                </div>

              <div className="mdc-dialog" role="alertdialog" aria-modal="true" aria-labelledby="my-dialog-title" aria-describedby="my-dialog-content" id="about">
                <div className="mdc-dialog__container">
                  <div className="mdc-dialog__surface">
                    <h2 className="mdc-dialog__title" id="about-dialog-title">About</h2>
                    <div className="mdc-dialog__content" id="about-dialog-content">
                      <p>Copyright &copy; 2019 Marco Parrone</p>
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

// Local Variables:
// mode: rjsx
// End:
