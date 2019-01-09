import {
    core,
} from 'werewolf-core';

/**
 * ログオブジェクト
 */
type Log = core.log.Log;

/**
 * プレイヤーの情報.
 */
type PlayerInfo = core.lib.info.PlayerInfo;


const field = core.field;

/**
 * イベント
 */
const event = core.event;

export {
    Log,
    PlayerInfo,

    field,
    event,
};
