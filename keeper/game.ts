// initialize game.
import {
    lib,
    core,
} from 'werewolf-core';
type Player = core.player.Player;
type Effect = core.effect.Effect;
type Field = core.field.Field;

const coreActions = core.action.default;

type G = lib.Game<Player, Effect, Field>;
type P = lib.Package<Player, Effect, Field>;

// 拡張ルール
interface R extends core.field.Rule{
    // 時間系
    dayTime: number;   // 秒
    nightTime: number; // 秒
    additionalTime: number;
}

export {
    G as Game,
    P as Package,
    R as Rule,
};

export function initGame(rule: R, pkgs: Array<P>): G{
    const f = core.field.initField(rule);
    const game = new lib.Game<Player, Effect, Field>(f);

    game.loadActions(coreActions);

    for (let p of pkgs){
        game.loadPackage(p);
    }
    return game;
}
