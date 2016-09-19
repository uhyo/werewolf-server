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

const initialState: RoomState = {
    logs: [{
        type: 'message',
        name: 'てすと次郎',
        message: 'がおーーーー',
    }],
};

export function createRoomStore(): Store<RoomState>{
    return createStore<RoomState>(roomReducer, initialState);
}
