// Web Socket connection to the server.

declare var _g_roomid: number | undefined;

export class Socket{
    private ws: WebSocket;
    public onmessage: (data: any)=>void | undefined;

    private reconnectionBase: number = 500;
    private reconnectionPow: number = 2;
    private reconnectionCount: number = 0;
    private reconnectionTimer: number;
    private reconnectionMax: number = 30000;
    constructor(){
        this.startConnection();
    }
    private startConnection(): void{
        console.debug('Requested websocket connection');
        // to the same location.
        const origin = location.origin.replace(/^http/, 'ws');
        const roomid = 'number' === typeof _g_roomid ? _g_roomid : 0;
        const ws = this.ws = new WebSocket(`${origin}/ws/${roomid}`);

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
        ws.onerror = (ev)=>{
            console.error(ev);
        };
        ws.onopen = ()=>{
            // successed to open.
            console.debug('WebSocket connection open');
            this.reconnectionCount = 0;
        };
        ws.onclose = ()=>{
            // reconnection attempt
            console.debug('WebSocket connection closed');
            clearTimeout(this.reconnectionTimer);
            const interval = Math.min(this.reconnectionMax, this.reconnectionBase * Math.pow(this.reconnectionPow, this.reconnectionCount++));
            this.reconnectionTimer = setTimeout(()=>{
                console.debug(`WebSocket reconnection attempt #${this.reconnectionCount}`);
                this.startConnection();
            }, interval);
        };
    }
    public close(): void{
        this.ws.close();
    }
}
