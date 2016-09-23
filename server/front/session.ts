// sessionを発行する
import {
    generateSessionId,
    isSessionExists,
    initSession,
} from '../db/session';

// クライアントの自己申告を見つつセッションIDを決める
export function getMySessionId(input: string | undefined): Promise<string>{
    if (input == null){
        // 新規発行
        return generateSessionId().then(sessionid=> initSession(sessionid).then(()=>sessionid));
    }else{
        // 有効なセッションかどうか調べる
        return isSessionExists(input).then(bl=>{
            if (bl){
                // このセッションIDは有効のようだ
                return input as string;
            }else{
                // このIDは怪しいから新しいセッションIDを発行
                return generateSessionId().then(sessionid=>{
                    return initSession(sessionid).then(()=>sessionid);
                });
            }
        });
    }
}
