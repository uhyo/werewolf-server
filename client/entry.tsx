import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {
    getApp,
}from './component/app';

document.addEventListener('DOMContentLoaded', ()=>{
    const ap = getApp();

    ReactDOM.render(ap, document.getElementById('app'));
}, false);
