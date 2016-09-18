import * as React from 'react';
import LogsComponent from './logs';
import {
    Log,
} from '../state/index';

export default class extends React.Component<{}, {}>{
    render(){
        const logs: Array<Log> = [{
            type: 'message',
            name: 'てすと太郎',
            message: 'がおーーーー',
        }];
        return <div>
            <LogsComponent logs={logs} />
        </div>;
    }
}
