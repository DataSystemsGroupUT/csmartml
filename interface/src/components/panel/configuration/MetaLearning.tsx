import * as React from "react";
import { Heading, RadioButtonGroup, Button, Layer, Box, TextInput, FormField, TextArea, Select } from "grommet";
import ParamBox from "./ParamBox";
import ReactTooltip from 'react-tooltip';
import { Configure, Close } from 'grommet-icons';
import BottomPadBox from "../../custom-grommet/BottomPadBox";

import { ALGORITHMS, SINGLE_METRICS, MULTI_OBJ_METRICS, EVALUATION_TYPES} from "../../../constants/TaskConfiguration";

interface MetaLearningProps {

    algorithm: string
    metric: string
    metaLearning: boolean
    toggleMetaLearning: (metaLearning: boolean) => void;
    setAlgorithm: (algorithm: string) => void;
    setMetric: (metric: string) => void;

}

interface MetaLearningState {
    options: any []
    algorithms: any []
    evaluation_types: any []
    single_metric_list: any []
    multi_metric_list: any []
    metric_list: any []
    value: string
    not_meta_options: boolean
    evaluation: string
}

class MetaLearning extends React.Component<MetaLearningProps, MetaLearningState>{

    constructor(props: MetaLearningProps) {
        super(props);
        this.state = {
            options: [{label: 'Algorithm & CVI Selection', value: "meta"}, {label: 'No meta-learning', value: "no-meta"}],
            evaluation_types: EVALUATION_TYPES,
            single_metric_list: SINGLE_METRICS,
            multi_metric_list: MULTI_OBJ_METRICS,
            metric_list: MULTI_OBJ_METRICS,
            algorithms: ALGORITHMS,
            value: "meta",
            evaluation: "multi",
            not_meta_options: false,
        }
    }

    onSelect = (value) => {
        this.setState({value: value})
        if (value == "meta") {
            this.props.toggleMetaLearning(true)
        }else{
            this.props.toggleMetaLearning(false)
        }
    }

    onCloseModal = () => {
        this.setState({not_meta_options: false})
    }

    onOpenModal = () => {
        this.setState({not_meta_options: true})
    }

    onSelectEvaluationType = (metric_type) => {
        this.setState({evaluation: metric_type})
        if(metric_type == "single"){
            this.setState({metric_list: SINGLE_METRICS})
            this.props.setMetric("cvi-1")
        }else{
            this.setState({metric_list: MULTI_OBJ_METRICS})
            this.props.setMetric("cvi-102")
        }

    }

    onSelectMetric = (metric) => {
        this.props.setMetric(metric.value)
    }

    onSelectAlgorithm = (algorithm) => {
        this.props.setAlgorithm(algorithm)
    }



    render(){
        const { options, not_meta_options, value, algorithms, evaluation, evaluation_types, metric_list } = this.state;
        const { metaLearning, algorithm, metric } = this.props

        const label = "Recommend suitable algorithms and evaluation metrics for your dataset"
        return (
            <ParamBox>
                <Heading margin="none" level={5} data-tip={label} data-place={"right"}> Meta-learning </Heading>
                <RadioButtonGroup
                    name="radio"
                    options={ options }
                    value={value}
                    onChange={event => this.onSelect(event.target.value)}
                />
                {!metaLearning && (
                    <Button icon={<Configure />} label="Set Configuration" onClick={this.onOpenModal}/>
                )}
                {not_meta_options && (
                    <Layer
                        position="right"
                        full="vertical"
                        modal
                        onClickOutside={this.onCloseModal}
                        onEsc={this.onCloseModal}
                    >
                        <Box
                            fill="vertical"
                            overflow="auto"
                            width="medium"
                            pad="medium"
                            onSubmit={this.onCloseModal}
                        >
                            <Box flex={false} direction="row" justify="between">
                                <Heading level={4} margin="none">
                                    Parameters
                                </Heading>
                                <Button icon={<Close />} onClick={this.onCloseModal} />
                            </Box>
                            <Box flex="grow" overflow="auto" pad={{ vertical: 'medium' }}>
                                <BottomPadBox>
                                    <Heading level={5} margin="none"> Select Algorithm </Heading>
                                    <Select
                                        options={algorithms}
                                        value={algorithm}
                                        labelKey={"label"}
                                        valueKey={{key: "value", reduce: true}}
                                        placeholder={"Tap to select"}
                                        onChange={({ value: nextValue }) => this.onSelectAlgorithm(nextValue)}
                                    />
                                </BottomPadBox>
                                <BottomPadBox>
                                    <Heading level={5} margin="none"> Evaluation Type </Heading>
                                    <RadioButtonGroup
                                        name="evaluation_types"
                                        options={evaluation_types}
                                        value={evaluation}
                                        onChange={event => this.onSelectEvaluationType(event.target.value)}
                                    />
                                </BottomPadBox>
                                <BottomPadBox>
                                    <Heading level={5} margin="none"> Select Metric(s) </Heading>
                                    <Select
                                        options={metric_list}
                                        value={metric}
                                        labelKey={"label"}
                                        valueKey={{key: "value", reduce:true}}
                                        placeholder={"Tap to select"}
                                        onChange={({ option }) => this.onSelectMetric(option)}
                                    />
                                </BottomPadBox>

                            </Box>
                            <Box flex={false} as="footer" align="start">
                                <Button
                                    type="submit"
                                    label="Done"
                                    onClick={this.onCloseModal}
                                    primary
                                />
                            </Box>
                        </Box>
                    </Layer>
                )}
            </ParamBox>

        );
    }


}

export default MetaLearning;