// Web Socket connection to the server.

export type SocketStatus =
    'connecting' |   // 通信開始中
    'open' |         // 通信中
    'reconnecting' | // 通信が切れた
    'closed'         // 通信終了

export class Socket{
    private roomid: number;
    private ws: WebSocket;
    public state: SocketStatus = 'connecting';
    // api
    public onopen: ()=>void | undefined;
    public onmessage: (data: any)=>void | undefined;

    // write queue
    private queue: Array<any> = [];

    // reconnection status
    private reconnectionBase: number = 500;
    private reconnectionPow: number = 2;
    private reconnectionCount: number = 0;
    private reconnectionTimer: number;
    private reconnectionMax: number = 30000;
    constructor(roomid: number){
        this.roomid = roomid;
        this.startConnection();
    }
    private startConnection(): void{
        console.debug('Requested websocket connection');
        this.state = 'connecting';
        // to the same location.
        const origin = location.origin.replace(/^http/, 'ws');
        const ws = this.ws = new WebSocket(`${origin}/ws/${this.roomid}`);

        ws.onmessage = (ev)=>{
            try {
                const obj = JSON.parse(ev.data.toString());
                if (this.onmessage){
                    this.onmessage(obj);
                }
            }catch (e){
                console.error(e);
            }
        };
        ws.onerror = (er)=>{
            console.error(er);
        };
        ws.onopen = ()=>{
            // successed to open.
            console.debug('WebSocket connection open');
            const firstopen = this.state === 'connecting';
            this.state = 'open';
            this.reconnectionCount = 0;
            if (firstopen && this.onopen){
                // キューに入っているデータを発信する
                for (let obj of this.queue){
                    this.send(obj);
                }
                this.queue = [];
                this.onopen();
            }
        };
        ws.onclose = ()=>{
            // reconnection attempt
            console.debug('WebSocket connection closed');
            this.state = 'reconnecting';
            clearTimeout(this.reconnectionTimer);
            const interval = Math.min(this.reconnectionMax, this.reconnectionBase * Math.pow(this.reconnectionPow, this.reconnectionCount++));
            this.reconnectionTimer = setTimeout(()=>{
                console.debug(`WebSocket reconnection attempt #${this.reconnectionCount}`);
                this.startConnection();
            }, interval);
        };
    }
    public send(data: any): void{
        // send data to the server.
        if (this.state === 'connecting'){
            // まだ通信が開いていないのでキューに貯める
            this.queue.push(data);
        }else if (this.state !== 'open'){
            // 送れないぞ〜〜〜〜〜〜
            console.debug('WebSocket data is discarded', data);
            return;
        }
        const str = JSON.stringify(data);
        this.ws.send(str);
    }
    public close(): void{
        this.ws.close();
        this.state = 'closed';
    }
}
