// front server.
import * as express from 'express';
import * as config from 'config';
import * as path from 'path';

import * as ipc from './ipc';
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

app.set('view engine', 'ejs');
app.set('views', path.resolve('views'));

// app routings
app.get('/', (_req, res)=>{
    res.render('index', {
        title: config.get('site.title'),
    });
});
app.get('/room/:roomid', (req, res)=>{
    const roomid = parseInt(req.params['roomid']);
    if (Number.isNaN(roomid)){
        res.sendStatus(404);
        return;
    }
    // TODO
    res.render('index', {
        title: config.get('site.title'),
        roomid,
    });
});

// app setup
app.listen(config.get<number>('front.port'), ()=>{
    console.log('web server is ready');
});
app.ws('/ws/:gameid', (ws, req)=>{
    handleWs(ws, req);
});

// DEBUG
ipc.init(()=>{
    ipc.openNewRoom(1);
});