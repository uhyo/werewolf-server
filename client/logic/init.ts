// init room page
import {
    Store,
} from 'redux';
import {
    RoomState,
} from '../state/index';

export function initRoom(store: Store<RoomState>): void{
    const _socket = store.getState().socket;

    // TODO
}
