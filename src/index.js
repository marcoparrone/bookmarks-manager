import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
//import * as serviceWorker from './serviceWorker';

var m = document.createElement('meta');
m.name = 'theme-color';
m.content = getComputedStyle(document.documentElement).getPropertyValue('--color-scheme-background');
document.head.appendChild(m);

ReactDOM.render(<App />, document.getElementById('root'));

//serviceWorker.register(); -- I want to use my custom service worker not the create-react-app one.

navigator.serviceWorker.register('service-worker.js');
