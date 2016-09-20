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
    Socket,
} from '../ws/ws';

export function createRoomStore(): Store<RoomState>{
    const initialState: RoomState = {
        socket: new Socket(),
        logs: [{
            type: 'message',
            name: 'てすと次郎',
            message: 'がおーーーー',
        }],
    };

    return createStore<RoomState>(roomReducer, initialState);
}
