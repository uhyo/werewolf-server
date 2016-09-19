import * as React from 'react';
import LogsContainer from '../container/logs';
import {
    Log,
} from '../state/index';

export default class extends React.Component<{}, {}>{
    render(){
        return <div>
            <LogsContainer />
        </div>;
    }
}
