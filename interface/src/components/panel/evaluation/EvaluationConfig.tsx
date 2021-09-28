import * as React from 'react';
import {Clock, Meter, Box, Heading, Header, Paragraph} from "grommet";
import ParamBox from "../configuration/ParamBox";


import {
    LABELED_ALGORITHMS_DICT,
    LABELED_CVI_DICT
} from "../../../constants/TaskConfiguration";

export interface EvaluationConfigProps{
    algorithm: string
    metric: string
    metaLearning: boolean
}

export interface EvaluationConfigState {
    algorithm: string
    metric: string
    metaLearning: boolean
}


export default class EvaluationConfig extends React.Component<EvaluationConfigProps, EvaluationConfigState>{

    constructor(props : EvaluationConfigProps) {
        super(props);
        this.state = {
            algorithm: props.algorithm,
            metric: props.metric,
            metaLearning: props.metaLearning
        }
    }

    componentDidUpdate(prevProps: EvaluationConfigProps, prevState: EvaluationConfigState) {
        if(prevProps.algorithm != this.props.algorithm){
            this.setState({algorithm: this.props.algorithm})
        }

        if(prevProps.metric != this.props.metric){
            this.setState({metric: this.props.metric})
        }

        if(prevProps.metaLearning != this.props.metaLearning){
            this.setState({metaLearning: this.props.metaLearning})
        }
    }


    render() {
        const { algorithm, metric, metaLearning } = this.state;
        return (
            <Box
                pad={{horizontal: "medium", bottom:"medium"}}
                border={{side: "bottom", color: "brand", size: "xsmall", style: "solid"}}
            >

                <Header background="none" margin={"none"}>
                    <Heading level={5}> Configurations </Heading>
                </Header>

                { metaLearning ? (
                    <Box>

                         <Paragraph margin={"none"}> Selected Algorithm: <b> {algorithm} </b> </Paragraph>
                    <Paragraph margin={"none"}> Evaluation Metric:   <b> {metric} </b> </Paragraph>

                    </Box>

                ) : (
                      <Box>

                         <Paragraph margin={"none"}> Selected Algorithm: <b> {LABELED_ALGORITHMS_DICT[algorithm]} </b> </Paragraph>
                    <Paragraph margin={"none"}> Evaluation Metric:   <b> {LABELED_CVI_DICT[metric]} </b> </Paragraph>

                    </Box>

                    )}



            </Box>
        )
    }


}