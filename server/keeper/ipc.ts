// conf for node-ipc
export const ipcConf = {
    appspace: 'werewolfcore.',
    // TODO
    stopRetrying: 2,
};

// ipc event names
export const IPC_EVENT_REGISTER = 'register';
/*
 * [front] <- [room]
 * Register room to the front server.
 *
 * id (string): ipc socket id
 * gameid (number): game id
 */
export interface IPCRegister{
    id: string;
    gameid: number;
}
export const IPC_EVENT_PING = 'ping';
/*
 * [front] -> [room]
 * Heartbeat ping.
 * code (string): ping id.
 */
export const IPC_EVENT_PONG = 'pong';
/*
 * [front] <- [room]
 * Heartbeat pong.
 * code (string): ping id.
 */
export interface IPCPing{
    code: string;
}


export const IPC_EVENT_CLIENTMESSAGE = 'clientmessage';
/*
 * [front] -> [room]
 * Message from a client.
 * sessionid (string): unique id for client from which this data comes
 * gameid (number): address game id.
 * payload (object): payload.
 */
export interface IPCClientMessage{
    sessionid: string;
    gameid: number;
    payload: any;
}
export const IPC_EVENT_SERVERMESSAGE = 'servermessage';
/*
 * [front] <- [room]
 * Message to a client.
 * sessionid (string): unique id for client to which this data is sent
 * gameid (number)
 * payload (object): payload.
 */
export interface IPCServerMessage{
    sessionid: string;
    gameid: number;
    payload: any;
}
