// init web socket.
import {
    Socket,
} from './ws';
declare var _g_roomid: number | undefined;

export function initRoomSocket(): Socket{
    const roomid = 'number' === typeof _g_roomid ? _g_roomid : 0;
    return new Socket(roomid);
}
