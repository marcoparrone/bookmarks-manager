import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

var m = document.createElement('meta');
m.name = 'theme-color';
m.content = getComputedStyle(document.documentElement).getPropertyValue('--color-scheme-background');
document.head.appendChild(m);

ReactDOM.render(<App />, document.getElementById('root'));
