import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import CreateRoutes from './Router.js';
import React from 'react';

//ReactDOM.render(<App />, document.getElementById('root'));
ReactDOM.render(<CreateRoutes />, document.getElementById('root'));
registerServiceWorker();
