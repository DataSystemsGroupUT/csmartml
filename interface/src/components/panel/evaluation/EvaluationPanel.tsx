import * as React from 'react';
import { Box } from 'grommet';
import EvaluationProgress from "./EvaluationProgress";
import EvaluationConfig from "./EvaluationConfig";
import EvaluationViz from "./EvaluationViz";

export interface EvaluationPanelProps{
    timeBudget: string
    taskStatus: boolean
    taskLabel: string
    algorithm: string
    metric: string
    configuration: string
    configurations: {}
    pcaData: []
    rawData: []
    setTaskLabel: (taskLabel: string) => void;
    setTimeBudget: (timeBudget: string) => void;
}

export default class EvaluationPanel extends React.Component<EvaluationPanelProps, {}>{
    constructor(props: EvaluationPanelProps) {
        super(props);
    }

    render(){
        return(
            <Box>
                <EvaluationViz {...this.props}/>
                <EvaluationConfig {...this.props}/>
                <EvaluationProgress {...this.props}/>
            </Box>
        );
    }


}