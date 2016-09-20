import {
    Request,
} from 'express';
import * as WebSocket from 'ws';

import {
    getRoomConnection,
    EVENT_SERVER_DESTROY,
    EVENT_CLIENT_MESSAGE,
    EVENT_SERVER_MESSAGE,
} from './ipc';


export function handleWs(ws: WebSocket, req: Request): void{
    // clientからのconnectionをhandleする
    const {
        sessionid,
    } = req.query;
    const {
        gameid,
    } = req.params;

    console.log('WS Conn', gameid);

    const event = getRoomConnection(parseInt(gameid));
    if (event == null){
        // そんな部屋はなかったようだ
        ws.close();
        return;
    }
    // 部屋があったので回線をつなぐ
    let messageHandler = (data: any)=>{
        const str: string = data.toString();
        try {
            // JSONで解釈する
            const payload = JSON.parse(str);
            // 中継
            event.emit(EVENT_CLIENT_MESSAGE, {
                sessionid,
                payload,
            });
        }catch (e){
            // 許さない
            ws.close();
        }
    };
    ws.on('message', messageHandler);
    let serverHandler = (obj: any)=>{
        if (obj == null){
            return;
        }
        if (sessionid !== obj.sessionid){
            return;
        }
        // 自分宛だ
        const data = JSON.stringify(obj.payload);
        ws.send(data);
    };
    event.on(EVENT_SERVER_MESSAGE, serverHandler);

    ws.on('close', ()=>{
        ws.removeListener('message', messageHandler);
        event.removeListener(EVENT_SERVER_MESSAGE, serverHandler);
    });

}
