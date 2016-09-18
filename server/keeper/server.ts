// game keeper server.
import {
    Keeper,
} from './keeper';
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
    CLIENT_JOIN,
    CLIENT_UNJOIN,
} from './protocol';
import {
    SessionUser,
    getUserData,
} from '../db/session';


const ipc: any = require('node-ipc');
Object.assign(ipc.config, ipcConf);

interface User extends SessionUser{
    sessionid: string;
}
interface UserDict{
    [sessionid: string]: User;
}

export class Server{
    private keeper: Keeper;
    private id: string;
    private connected: boolean = false;
    private users: UserDict;
    constructor(private parent: string, private gameid: number){
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
            this.handleClientMessage(sessionid, payload);
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
    private sendToClient(sessionid: string, payload: any): void{
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
    private handleClientMessage(sessionid: string, payload: any): void{
        if (payload == null){
            return;
        }
        const {
            type,
        } = payload;
        switch (type){
            case CLIENT_JOIN: {
                // add this user to room members.
                this.handleJoinUser(sessionid);
                break;
            }
            case CLIENT_UNJOIN: {
                this.handleUnjoinUser(sessionid);
                break;
            }
            default: {
                // TODO DEBUG
                this.sendToClient(sessionid, {
                    hi: 'there',
                });
            }
        }
    }
    private handleJoinUser(sessionid: string): void{
        if (this.keeper.isGameStarted()){
            // ゲーム開始してるからもう無理
            // TODO
            return;
        }
        const {
            users,
        } = this;
        if (users[sessionid] != null){
            // TODO: error handling
            return;
        }
        getUserData(sessionid).then(obj=>{
            if (obj == null || obj.userid == null){
                // not a logged-in user
                throw new Error('Not logged in');
            }
            const u: User = {
                sessionid,
                userid: obj.userid,
                display_id: obj.display_id,
                name: obj.name,
            };
            users[sessionid] = u;
        }).catch(_err=>{
            // TODO
        });
    }
    private handleUnjoinUser(sessionid: string): void{
        if (this.keeper.isGameStarted()){
            // TODO
            return;
        }
        const {
            users,
        } = this;
        if (users[sessionid] == null){
            // TODO: error handling
            return;
        }
        delete users[sessionid];
    }
    // close connection.
    public close(): void{
        this.connected = false;
        ipc.disconnect(this.parent);
    }
}
