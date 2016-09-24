// init room page
import {
    Store,
} from 'redux';
import {
    RoomState,
} from '../state/index';
import {
    CLIENT_INIT,
} from '../../shared/protocol';

export function initRoom(store: Store<RoomState>): void{
    const socket = store.getState().socket;

    // 部屋の状況を要求する
    socket.send({
        type: CLIENT_INIT,
    });
}
