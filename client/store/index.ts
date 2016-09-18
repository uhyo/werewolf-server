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
    logs: [],
};

export function createRoomStore(): Store<RoomState>{
    return createStore<RoomState>(roomReducer, initialState);
}
