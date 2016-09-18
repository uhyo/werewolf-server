// game keeper.
import {
    Game,
    initGame,
    Package,
    Rule,
} from './game';
import {
    State,
} from './state';
import {
    core,
} from 'werewolf-core';
const {
    PHASE_DAY,
    PHASE_NIGHT,
} = core.field;

const {
    initNextPhaseEvent,
    initQueryPlayerInfoEvent,
    initPullLogsEvent,
    initChoiceEvent,
} = core.event;
type Log = core.log.Log;
type PlayerInfo = core.lib.info.PlayerInfo;

export class Keeper{
    private game: Game;
    private state: State;
    private rule: Rule;

    private timerid: number | null = null;
    constructor(rule: Rule, pkgs: Array<Package>){
        this.rule = rule;
        this.game = initGame(rule, pkgs);
        this.state = 'prologue';
    }
    // start the game.
    public start(): void{
        if (this.state !== 'prologue'){
            throw new Error('Game has already started');
        }
        // 最初の夜にする
        this.state = 'playing';
        this.nextPhase();

        this.phaseTimer();
    }

    // set appropreate timer.
    private phaseTimer(): void{
        // 今走ってるタイマーがあれば解除
        if (this.timerid != null){
            clearTimeout(this.timerid);
        }
        // ゲーム状態を取得
        const f = this.game.getField();
        let time: number;
        switch (f.phase){
            case PHASE_DAY:
                // 昼だ
                time = this.rule.dayTime;
                break;
            case PHASE_NIGHT:
                time = this.rule.nightTime;
                break;
            default:
                // TODO
                time = 1;
        }
        this.timerid = setTimeout(this.nextPhase.bind(this), time*1000);
    }
    private nextPhase(): void{
        // call the game to go to the next phase.
        this.game.runEvent(initNextPhaseEvent());
        this.phaseTimer();
    }
    public pullLogs(): Array<Log>{
        // Get new logs from the game.
        const {
            logs,
            prevented,
        } = this.game.runEvent(initPullLogsEvent());
        return prevented ? [] : logs;
    }
    // Input from outer world.
    public choice(from: string, choice_id: string, value: string): void{
        const ev = initChoiceEvent({
            from,
            choice_id,
            value,
        });
        this.game.runEvent(ev);
    }
    public getInfoFor(playerid: string): PlayerInfo | undefined{
        const ev = this.game.runEvent(initQueryPlayerInfoEvent(playerid));
        // TODO
        return ev.result;
    }
    // getter.
    public isGameStarted(): boolean{
        return this.state !== 'prologue';
    }
}


