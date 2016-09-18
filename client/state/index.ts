// Store for room page
export interface RoomState{
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
