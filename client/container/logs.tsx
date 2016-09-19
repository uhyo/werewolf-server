import * as React from 'react';
import {
    connect,
} from 'react-redux';
import {
    defaultMemoize,
} from 'reselect';

import {
    RoomState,
    Log,
} from '../state/index';
import LogsComponent from '../component/logs';

interface IPropLogs {
    logs: Array<Log>;
}

const logsSelector = defaultMemoize(({logs}: RoomState)=>({logs} as IPropLogs));

const LogsContainer = connect(logsSelector)(LogsComponent);


export default LogsContainer;
