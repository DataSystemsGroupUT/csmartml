import * as React from 'react';
import {Clock, Meter, Box, Heading, Header, Paragraph} from "grommet";
import ParamBox from "../configuration/ParamBox";


export interface EvaluationConfigProps{
    algorithm: string
    metric: string
}

export interface EvaluationConfigState {
    algorithm: string
    metric: string

}


export default class EvaluationConfig extends React.Component<EvaluationConfigProps, EvaluationConfigState>{

    constructor(props : EvaluationConfigProps) {
        super(props);
        this.state = {
            algorithm: props.algorithm,
            metric: props.metric
        }
    }

    componentDidUpdate(prevProps: EvaluationConfigProps, prevState: EvaluationConfigState) {
        if(prevProps.algorithm != this.props.algorithm){
            this.setState({algorithm: this.props.algorithm})
        }

        if(prevProps.metric != this.props.metric){
            this.setState({metric: this.props.metric})
        }
    }


    render() {
        const { algorithm, metric } = this.state;
        return (
            <Box
                pad={{horizontal: "medium", bottom:"medium"}}
                border={{side: "bottom", color: "brand", size: "xsmall", style: "solid"}}
            >

                <Header background="none" margin={"none"}>
                    <Heading level={5}> Configurations </Heading>
                </Header>

                <Paragraph margin={"none"}> Selected Algorithm: <b> {algorithm} </b> </Paragraph>
                <Paragraph margin={"none"}> Evaluation Metric:   <b> {metric} </b> </Paragraph>

            </Box>
        )
    }


}