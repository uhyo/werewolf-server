// game keeper process.
import {
    Server,
} from './server';

// get arguments.
const [, , parent, gameidstr] = process.argv;

const gameid = parseInt(gameidstr);
if (parent == null || Number.isNaN(gameid)){
    throw new Error('Invalid argument');
}

const srv = new Server(parent, gameid);

process.on('SIGINT', ()=>{
    srv.close();
    process.exit(0);
});
