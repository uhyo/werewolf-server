// conf for node-ipc
export const ipcConf = {
    appspace: 'werewolfcore.',
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
export const IPC_EVENT_CLIENTMESSAGE = 'clientmessage';
/*
 * [front] -> [room]
 * Message from a client.
 * clientid (string): unique id for client from which this data comes
 * payload (object): payload.
 */
export const IPC_EVENT_SERVERMESSAGE = 'servermessage';
/*
 * [front] <- [room]
 * Message to a client.
 * clientid (string): unique id for client to which this data is sent
 * payload (object): payload.
 */
