// game keeper server.
import {
    Keeper,
} from './keeper';
import {
    Log,
} from '../core';
import {
    ipcConf,
    IPC_EVENT_REGISTER,
    IPCRegister,
    IPC_EVENT_PING,
    IPC_EVENT_PONG,
    IPCPing,
    IPC_EVENT_CLIENTMESSAGE,
    IPCClientMessage,
    IPC_EVENT_SERVERMESSAGE,
    IPCServerMessage,
} from './ipc';
import {
    SessionUser,
} from '../db/session';
import {
    GameStore,
    getGameStore,
} from '../db/game';
import {
    handleClientMessage,
} from './logic';


const ipc: any = require('node-ipc');
Object.assign(ipc.config, ipcConf);

export interface User extends SessionUser{
    sessionid: string;
}
export interface UserDict{
    [sessionid: string]: User;
}

export class Server{
    private gameStore: GameStore;
    public keeper: Keeper;
    private id: string;
    private connected: boolean = false;
    public users: UserDict;
    constructor(private parent: string, private gameid: number){
        this.gameStore = getGameStore();

        // parent: ipc name of parent process
        this.id = `game${gameid}`;
        ipc.config.id = this.id;
        ipc.connectTo(parent, ()=>{
            this.connected = true;
            this.startConnection();
        });
    }
    private startConnection(): void{
        const {
            parent,
        } = this;
        const front = ipc.of[parent];
        // Register myself to the front server.
        const mes: IPCRegister = {
            id: this.id,
            gameid: this.gameid,
        };
        front.emit(IPC_EVENT_REGISTER, mes);
        // register events.
        front.on(IPC_EVENT_CLIENTMESSAGE, (obj: IPCClientMessage)=>{
            if (obj == null){
                ipc.log('Invalid data from the front');
                return;
            }
            const {
                sessionid,
                payload,
            } = obj;
            handleClientMessage(this, sessionid, payload);
        });
        front.on(IPC_EVENT_PING, (obj: IPCPing)=>{
            // PINGにはPONGを返さないといけない
            if (obj == null){
                return;
            }
            const {
                code,
            } = obj;
            front.emit(IPC_EVENT_PONG, {
                code,
            });
        });
        front.on('destroy', ()=>{
            // connection is totally closed.
            // TODO
            console.log('Connection is destroyed');
            process.exit(0);
        });
    }
    public sendToClient(sessionid: string, payload: any): void{
        if (this.connected === false){
            return;
        }
        const {
            parent,
        } = this;
        const front = ipc.of[parent];
        const mes: IPCServerMessage = {
            sessionid,
            gameid: this.gameid,
            payload,
        };
        front.emit(IPC_EVENT_SERVERMESSAGE, mes);
    }
    // close connection.
    public close(): void{
        this.connected = false;
        ipc.disconnect(this.parent);
    }

    // ----
    public getLogs(): Promise<Array<Log>|null>{
        return this.gameStore.getLogs(this.gameid);
    }
}
