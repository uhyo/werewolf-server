import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {
    Provider,
} from 'react-redux';
import {
    createRoomStore,
} from './store/index';
import {
    initRoom,
} from './logic/init';
import MainComponent from './component/main';

document.addEventListener('DOMContentLoaded', ()=>{
    const store = createRoomStore();
    const ap = <Provider store={store}>
        <MainComponent/>
    </Provider>;

    initRoom(store);

    ReactDOM.render(ap, document.getElementById('app'));
}, false);
