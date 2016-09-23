import {
    createStore,
    Store,
} from 'redux';
import {
    RoomState,
} from '../state/index';
import {
    roomReducer,
} from '../reducer/index';
import {
    initRoomSocket,
} from '../ws/index';

export function createRoomStore(): Store<RoomState>{
    const socket = initRoomSocket();
    const initialState: RoomState = {
        socket,
        logs: [{
            type: 'message',
            name: 'てすと次郎',
            message: 'がおーーーー',
        }],
    };

    return createStore<RoomState>(roomReducer, initialState);
}
