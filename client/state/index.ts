import {
    Socket,
} from '../ws/ws';
// Store for room page
export interface RoomState{
    socket: Socket;
    logs: Array<Log>;
}

// 画面に表示されるログだ
export interface MessageLog{
    type: 'message';
    // おなまえ
    name: string;
    // メッセージ
    message: string;
}

export type Log = MessageLog;
