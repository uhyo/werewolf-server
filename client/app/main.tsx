import * as React from 'react';
import {
    Provider,
    ProviderProps,
} from 'react-redux';
import {
    createRoomStore,
} from '../store/index';
import MainComponent from './component/main';

// room
export function getApp(): React.ReactElement<ProviderProps>{
    const store = createRoomStore();
    return <Provider store={store}>
        <MainComponent/>
    </Provider>;
}
