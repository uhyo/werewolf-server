// front server.
import * as express from 'express';
import * as config from 'config';
import {
    handleWs,
} from './ws';

const expressWs: any = require('express-ws');

// express-ws用の型定義
interface TExpressWs extends express.Express{
    ws(path: string, handler: (ws: any, req: express.Request)=> void): void;
}

const app = express() as TExpressWs;
const wsApi = expressWs(app);

// app routings
app.get('/', (_req, res)=>{
    res.send('Hello, world!');
});

// app setup
app.listen(config.get<number>('front.port'), ()=>{
    console.log('web server is ready');
});
app.ws('/ws/:roomid', (ws, req)=>{
    console.log('Handling ws conn');
    handleWs(ws, req);
});
