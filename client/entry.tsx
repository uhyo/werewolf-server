import * as React from 'react';
import * as ReactDOM from 'react-dom';
import AppComponent from './app/main';

document.addEventListener('DOMContentLoaded', ()=>{
    const ap = <AppComponent />;

    ReactDOM.render(ap, document.getElementById('app'));
}, false);
