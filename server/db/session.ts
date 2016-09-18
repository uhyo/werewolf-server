import {
    getRedisClient,
} from './redis';
import * as config from 'config';

const client = getRedisClient();

// sessionに紐付けられるUser情報
export interface SessionUser{
    // User ID
    userid: string | undefined;
    // Displayed user id
    display_id: string | undefined;
    // User name
    name: string | undefined;
}
function sessionUserKey(sessionid: string): string{
    const prefix: string = (config as any).redis.prefix.sessionuser;
    return prefix + sessionid;
}
// session management using redis.
export function getUserData(sessionid: string): Promise<SessionUser | undefined>{
    return new Promise<SessionUser | undefined>((resolve, reject)=>{
        client.hgetall(sessionUserKey(sessionid), (err: Error, obj: any)=>{
            if (err){
                reject(err);
            }else{
                resolve(obj);
            }
        });
    });
}

