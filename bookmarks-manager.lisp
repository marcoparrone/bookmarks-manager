;;; bookmarks-manager.lisp  ---  A bookmarks manager.

;; Copyright (C)  2017  Marco Parrone

;; Filename: bookmarks-manager.lisp
;; Version: It's still not complete
;; Updated: 5th of March 2017
;; Keywords: bookmarks, link, urls, manager
;; Author: Marco Parrone <marco.parrone@gmail.com>
;; Maintainer: Marco Parrone <marco.parrone@gmail.com>
;; Description: A bookmarks manager.
;; Language: Common Lisp
;; Compatibility: Steel Bank Common Lisp 1.3.11.
;; Location: 

;; Permission is hereby granted, free of charge, to any person
;; obtaining a copy of this software and associated documentation
;; files (the "Software"), to deal in the Software without
;; restriction, including without limitation the rights to use, copy,
;; modify, merge, publish, distribute, sublicense, and/or sell copies
;; of the Software, and to permit persons to whom the Software is
;; furnished to do so, subject to the following conditions:

;; The above copyright notice and this permission notice shall be
;; included in all copies or substantial portions of the Software.

;; THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
;; EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
;; MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
;; NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
;; BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
;; ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
;; CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
;; SOFTWARE.

;;; Commentary:

;; A command-line bookmarks-manager implementation in Common Lisp.

;; I'm writing it for fun, for learning Common Lisp, and for
;; experimenting a new way of handing my web bookmarks.

;; The open-bookmark function is implementation-dependendant on SBCL.
;; I tested it on version 1.3.11.

;; The *browser* global variable is dependendant on the availability
;; of the xdg-open program, which is part of the freedesktop.org
;; project. I tested it on CentOS Linux release 7.3.1611.

;; The program isn't finished yet. For starting I will add some
;; function to load and save the bookmarks to a TXT file. Then in the
;; future I may add some sort of user interface. With a web interface
;; I could share bookmarks between different browsers, it could be
;; nice.

;;; Code:

(unintern 'bookmark)

(defclass bookmark ()
  ((name :initarg :name)
   (url :initarg :url)
   (description :initarg :description)
   (keywords :initarg :keywords)))

(fmakunbound 'print-bookmark)

(defgeneric print-bookmark (bookmark)
  (:documentation "Print a bookmark object."))

(defmethod print-bookmark ((bookmark bookmark))
  (format t "name: ~a~%url: ~a~%description: ~a~%keywords: ~a~%~%"
	  (slot-value bookmark 'name)
	  (slot-value bookmark 'url)
	  (slot-value bookmark 'description)
	  (slot-value bookmark 'keywords)))

(defun print-bookmarks (bookmarks)
  "Print all the elements of the bookmarks list (which must contain
only bookmark objects)."
  (loop
     for bookmark in bookmarks
     do (print-bookmark bookmark)))

(fmakunbound 'open-bookmark)

(defgeneric open-bookmark (bookmark)
  (:documentation "Open a bookmark in an external browser."))

(defvar *browser* "/usr/bin/xdg-open")

(defmethod open-bookmark ((bookmark bookmark))
  (sb-ext:run-program *browser* (list (slot-value bookmark 'url)) :wait nil))

(defun open-bookmarks (bookmarks)
  (loop
     for bookmark in bookmarks
     do (open-bookmark bookmark)))

(defun search-bookmarks (field keywords bookmarks)
  "For all the bookmarks found in the `bookmarks' list, search in
field `field' for any keyword found in the list of `keywords'.

Allowed values for `field' are: 'keywords 'name 'url 'description
'all-but-keywords

`keywords' is a list of symbols, `bookmarks' is a list of bookmark
objects."
  (let ((return-value nil))
    (loop
       for bookmark in bookmarks
       do (block keyword-found
	    (loop
	       for looking-for in keywords
	       do (let ((upcase-looking-for 
			 (if (not (eql field 'keywords))
			     (string-upcase looking-for)
			     "")))
		    (if
		     (or
		      (and (eql field 'keywords)
			   (some #'(lambda (the-keyword)
				     (eql the-keyword looking-for))
				 (slot-value bookmark 'keywords)))
		      (and (or (eql field 'name)
			       (eql field 'url)
			       (eql field 'description))
			   (search upcase-looking-for
				   (string-upcase (slot-value bookmark field))))
		      (and (eql field 'all-but-keywords)
			   (or
			    (search upcase-looking-for
				    (string-upcase (slot-value bookmark 'name)))
			    (search upcase-looking-for
				    (string-upcase (slot-value bookmark 'url)))
			    (search upcase-looking-for
				    (string-upcase (slot-value bookmark 'description))))))
		     (progn
		       (setq return-value (cons bookmark return-value))
		       (return-from keyword-found)))))))
       return-value))

(defvar *bookmarks* (list))

;;;; bookmarks-manager.lisp ends here.
