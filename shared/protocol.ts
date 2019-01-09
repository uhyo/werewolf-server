// client-server(room) protocol

// [client] -> [server]
// request a init data.
export const CLIENT_INIT = 'client.init';
/*
 * type: CLIENT_INIT,
 */


// [client] -> [server]
// join to the room.
export const CLIENT_JOIN = 'client.join';
/*
 * type: CLIENT_JOIN,
 */

// [client] -> [server]
// leave the room.
export const CLIENT_UNJOIN = 'client.unjoin';
/*
 * type: CLIENT_UNJOIN,
 */

// [server] -> [client]
// push a user status data.
export const SERVER_STATUS = 'server.status';
/*
 * type: SERVER_STATUS,
 * logs?: Array<Logs>
 */

