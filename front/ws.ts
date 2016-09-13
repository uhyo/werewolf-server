import {
    Request,
} from 'express';
import * as WebSocket from 'ws';
export function handleWs(ws: WebSocket, _req: Request): void{
    // sample
    ws.send('BOOM');
    ws.close();
}
