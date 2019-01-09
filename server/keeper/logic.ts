import {
    getUserData,
} from '../db/session';
import {
    CLIENT_INIT,
    CLIENT_JOIN,
    CLIENT_UNJOIN,
} from '../../shared/protocol';
import {
    Server,
    User,
} from './server';

// handles request from client.
export function handleClientMessage(server: Server, sessionid: string, payload: any): void{
    if (payload == null){
        return;
    }
    const {
        type,
    } = payload;
    switch (type){
        case CLIENT_INIT: {
            // client requested initial data.
            handleClientInit(server, sessionid);
            break;
        }
        case CLIENT_JOIN: {
            // add this user to room members.
            handleJoinUser(server, sessionid);
            break;
        }
        case CLIENT_UNJOIN: {
            handleUnjoinUser(server, sessionid);
            break;
        }
        default: {
            // TODO DEBUG
            server.sendToClient(sessionid, {
                hi: 'there',
            });
        }
    }
}

function handleClientInit(_server: Server, _sessionid: string): void{
}
function handleJoinUser(server: Server, sessionid: string): void{
    if (server.keeper.isGameStarted()){
        // ゲーム開始してるからもう無理
        // TODO
        return;
    }
    const {
        users,
    } = server;
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
function handleUnjoinUser(server: Server, sessionid: string): void{
    if (server.keeper.isGameStarted()){
        // TODO
        return;
    }
    const {
        users,
    } = server;
    if (users[sessionid] == null){
        // TODO: error handling
        return;
    }
    delete users[sessionid];
}
