import {
    Log,
} from '../core';

/**
 * ゲームの情報を持ってきてくれるやつ
 */
export abstract class GameStore{
    /**
     * 指定したゲームIDのログを全て取得する
     *
     * @param gameid ゲームID
     */
    abstract getLogs(gameid: number): Promise<Array<Log>|null>;
    /**
     * 指定したゲームIDに対してログを追加する
     *
     * @param logs 追加するログ
     */
    abstract pushLogs(gameid: number, logs: Array<Log>): Promise<void>;
}

/**
 * メモリ上に保存するやつ（テスト用）
 */
export class MemoryStore extends GameStore{
    private store: {[gameid: number]: Array<Log>} = {};

    public getLogs(gameid: any): Promise<Array<Log>|null>{
        return Promise.resolve(this.store[gameid] || null);
    }

    public pushLogs(gameid: number, logs: Array<Log>): Promise<void>{
        return new Promise((resolve)=>{
            if (this.store[gameid] == null){
                this.store[gameid] = [];
            }
            this.store[gameid].push(...logs);
            resolve();
        });
    }
}

let store: GameStore | undefined;

export function getGameStore(): GameStore{
    if (store == null){
        // TODO
        store = new MemoryStore();
    }
    return store;
}
