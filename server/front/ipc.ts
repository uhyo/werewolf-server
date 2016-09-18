// ipcでroom serverと通信する
import {
    ipcConf,
    IPC_EVENT_REGISTER,
    IPC_EVENT_PING,
    IPC_EVENT_PONG,
    IPCPing,
    IPC_EVENT_CLIENTMESSAGE,
    IPC_EVENT_SERVERMESSAGE,
    IPCRegister,
    IPCClientMessage,
    IPCServerMessage,
} from '../keeper/ipc';
import * as child_process from 'child_process';
import * as path from 'path';
import * as config from 'config';
import * as EventEmitter from 'eventemitter3';

// Events
export const EVENT_SERVER_DESTROY = 'server.destroy';
export const EVENT_CLIENT_MESSAGE = 'client.message';
export const EVENT_SERVER_MESSAGE = 'server.message';

const ipc: any = require('node-ipc');
Object.assign(ipc.config, ipcConf);

let myid: string | undefined;

// registerしてきたchildを覚える
const childTable: {
    [gameid: number]: {
        socket: any;
        event: EventEmitter;
    };
} = {};

export function init(callback?: ()=>void): void{
    // start accepting connections from room servers.
    // 自分のID
    myid = 'front-' + (0|(Math.random() * 0x40000000)).toString(36);
    ipc.config.id = myid;

    console.log('WOW', myid);
    // serverになる
    ipc.serve(()=>{
        console.log('IPC front server service has started');
        if (callback != null){
            callback();
        }
    });
    // イベントに反応
    ipc.server.on(IPC_EVENT_REGISTER, (obj: IPCRegister, socket: any)=>{
        if (obj == null){
            return;
        }
        const {
            gameid,
        } = obj;

        registerChild(gameid, socket);
    });
    ipc.server.on(IPC_EVENT_SERVERMESSAGE, (obj: IPCServerMessage)=>{
        if (obj == null){
            return;
        }
        const {
            sessionid,
            gameid,
            payload,
        } = obj;
        const c = childTable[gameid];
        if (c == null){
            return;
        }
        c.event.emit(EVENT_SERVER_MESSAGE, {
            sessionid,
            payload,
        });
    });

    ipc.server.start();
}
function registerChild(gameid: number, socket: any): void{
    // EventEmitterを作りsocketとひもづける
    const event = new EventEmitter();

    event.on(EVENT_CLIENT_MESSAGE, (obj: IPCClientMessage)=>{
        if (obj == null){
            return;
        }
        const {
            sessionid,
            payload,
        } = obj;
        const obj2: IPCClientMessage = {
            sessionid,
            gameid,
            payload,
        };
        ipc.server.emit(socket, IPC_EVENT_CLIENTMESSAGE, obj2);
    });
    childTable[gameid] = {
        socket,
        event,
    };
    keepChild(gameid);
}
function keepChild(gameid: number): void{
    // childの死活監視
    const heartbeat = config.get<number>('ipc.heartbeat');

    // heartbeat時間ごとにpingを送る
    setTimeout(()=>{
        const timeout = config.get<number>('ipc.timeout');

        const c = childTable[gameid];
        if (c == null){
            return;
        }
        const {
            socket,
        } = c;
        const code = (0|(Math.random() * 0x40000000)).toString(16);
        const p: IPCPing = {
            code,
        };
        ipc.server.emit(socket, IPC_EVENT_PING, p);
        // timeout handler.
        const timeoutid = setTimeout(()=>{
            destroyChild(gameid);
        }, timeout * 1000);
        // pong handler.
        let handler = (obj: IPCPing)=>{
            if (obj != null && obj.code === code){
                // pongが返ってきたので合格。次回へ
                keepChild(gameid);
                ipc.server.off(IPC_EVENT_PONG, handler);
                clearTimeout(timeoutid);
            }
        };
        ipc.server.on(IPC_EVENT_PONG, handler);
    }, heartbeat * 1000);
}
// roomとの通信を終了
function destroyChild(gameid: number): void{
    const obj = childTable[gameid];
    if (obj == null){
        return;
    }
    const {
        socket,
        event,
    } = obj;
    event.emit(EVENT_SERVER_DESTROY);
    delete childTable[gameid];
}

// API: subscribe to room
export function getRoomConnection(gameid: number): EventEmitter | null{
    const c = childTable[gameid];
    if (c == null){
        return null;
    }
    return c.event;
}

// API: open new room (TODO)
export function openNewRoom(gameid: number): void{
    if (myid == null){
        throw new Error('The server is not prepared yet');
    }
    const command = process.execPath;
    const mod = path.resolve(__dirname, '../keeper/bin');
    const args = [...(process.execArgv), mod, myid, String(gameid)];
    const child = child_process.spawn(command, args, {
        // debug
        detached: false,
        stdio: 'inherit',
    });
    console.log('opened new process %d', child.pid);
}

