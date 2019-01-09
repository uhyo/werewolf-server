import * as React from 'react';
import shallowCompare = require('react-addons-shallow-compare');
import {
    Log,
} from '../state/index';
import * as logsCSS from '../sass/logs.css';

// component that show logs.
interface IPropLog {
    log: Log;
}
interface IStateLog {
}

/**
 * Logを1つ表示するcomponent
 */
class LogComponent extends React.Component<IPropLog, IStateLog>{
    constructor(props: IPropLog){
        super(props);
    }
    shouldComponentUpdate(nextProps: IPropLog, nextState: IStateLog){
        return shallowCompare(this, nextProps, nextState);
    }
    render(){
        const {
            props: {
                log,
            },
        } = this;
        switch (log.type){
            case 'message': {
                return <div className={logsCSS.log}>
                    <span>{log.name}</span>
                    <span>{log.message}</span>
                </div>;
            }
        }
        return null;
    }
}

interface IPropLogs {
    logs: Array<Log>;
}
interface IStateLogs {
}

/**
 * logを全て表示するcomponent
 */
class LogsComponent extends React.Component<IPropLogs, IStateLogs>{
    shouldComponentUpdate(nextProps: IPropLogs, nextState: IStateLogs){
        return shallowCompare(this, nextProps, nextState);
    }
    render(){
        const {
            props: {
                logs,
            },
        } = this;
        return <div>{
            // TODO
            logs.map(l => <LogComponent log={l} key={l.name+l.message}/>)
        }</div>;
    }
}

export default LogsComponent;
