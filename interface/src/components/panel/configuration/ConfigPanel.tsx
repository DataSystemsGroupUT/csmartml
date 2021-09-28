import * as React from 'react';
import { Box, Button, Form } from 'grommet';

// Component import
import MetaLearning from "./MetaLearning";
import DatasetSelector from "./DatasetSelector";
import TimeBudget from "./TimeBudget";
import ConfigResults from "./ConfigResults";


export interface ConfigPanelProps {
    datasetName: string
    timeBudget: string
    uploadedCSV: any
    metaLearning: boolean
    algorithm: string
    metric: string
    resultPreference: string
    setResultPreference: (resultPreference: string) => void;
    toggleMetaLearning: (metaLearning: boolean) => void;
    setCSVFile: (csvfile: any) => void;
    setTimeBudget: (timeBudget: string) => void;
    setAlgorithm: (algorithm: string) => void;
    setMetric: (metric: string) => void;
    setDatasetName: (datasetName: string) => void;
    startTaskRun: () => void;
}

export interface ConfigPanelState{
    dataset: string
}


export default class ConfigPanel extends React.Component<ConfigPanelProps, ConfigPanelState>{

    constructor(props: ConfigPanelProps) {
        super(props);
        this.state = { dataset: "None"}
    }

    render() {
        return (
           <Form onSubmit={this.props.startTaskRun}>
               <DatasetSelector {...this.props}/>
               <MetaLearning
                   {...this.props}
               />
               <TimeBudget {...this.props}/>
               <ConfigResults {...this.props}/>
               <Box direction="row" gap="medium" pad="medium">
                <Button type="submit" primary label="Start"/>
                <Button type="reset" label="Reset" active={false}/>
              </Box>
           </Form>
        );
    }

}
