import React from 'react';
import ReactDOM from 'react-dom';
import MainRouter from './router';
import {Provider} from 'react-redux'
import store from './store'
import {createBrowserHistory} from 'history'

import './style.scss';

const history = createBrowserHistory();

ReactDOM.render(
    <Provider store={store} history={history}>
        <MainRouter/>
    </Provider>,
    document.getElementById('root')
);