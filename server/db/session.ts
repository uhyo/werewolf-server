import {
    getRedisClient,
} from './redis';
import * as config from 'config';
import * as crypto from 'crypto';
// session management using redis.

const client = getRedisClient();

// session id gen.
export function generateSessionId(): Promise<string>{
    return new Promise((resolve, reject)=>{
        crypto.randomBytes(config.get<number>('session.idlength'), (err, buf)=>{
            if (err != null){
                reject(err);
            }else{
                resolve(buf.toString('hex'));
            }
        });
    });
}

// sessionに紐付けられるUser情報
export interface SessionUser{
    // User ID
    userid: string | undefined;
    // Displayed user id
    display_id: string | undefined;
    // User name
    name: string | undefined;
}
// redisにセッションの情報を入れるためのキー
function sessionUserKey(sessionid: string): string{
    const prefix: string = (config as any).redis.prefix.sessionuser;
    return prefix + sessionid;
}

// セッションIDが存在するかどうか調べる
export function isSessionExists(sessionid: string): Promise<boolean>{
    return new Promise((resolve, reject)=>{
        client.exists(sessionUserKey(sessionid), (err: Error, count: number)=>{
            if (err){
                reject(err);
            }else{
                resolve(count > 0);
            }
        });
    });
}
// セッションIDからユーザー情報
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
// あたらしいセッションを発行
export function initSession(sessionid: string): Promise<void>{
    return new Promise((resolve, reject)=>{
        const empty: SessionUser = {
            userid: '',
            display_id: '',
            name: '',
        };
        const sesskey = sessionUserKey(sessionid);
        client.hmset(sesskey, empty, err=>{
            if (err){
                reject(err);
            }else{
                client.expire(sesskey, config.get<number>('session.age'), (err: Error)=>{
                    if (err){
                        reject(err);
                    }else{
                        resolve();
                    }
                });
            }
        });
    });
}
