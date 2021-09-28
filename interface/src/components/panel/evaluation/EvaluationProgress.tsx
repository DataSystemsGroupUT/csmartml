import * as React from 'react';
import {Clock, Meter, Box, Heading, Header, Text} from "grommet";

export interface EvaluationProgressProps{
    timeBudget: string
    taskStatus: boolean
    taskLabel: string
    setTaskLabel: (taskLabel: string) => void;
    setTimeBudget: (timeBudget: string) => void;
}

export interface EvaluationProgressState{
    time: string,
    timeBudget: string,
    status: boolean|"backward",
    progress: number
}



export default class EvaluationProgress extends React.Component<EvaluationProgressProps, EvaluationProgressState>{

    constructor(props : EvaluationProgressProps) {
        super(props);
        this.state = {
            time: "PT0H10M0S",
            status: false,
            progress: 0,
            timeBudget: props.timeBudget

        }
    }

    componentDidUpdate(prevProps: EvaluationProgressProps, prevState: EvaluationProgressState) {
        if((prevProps.timeBudget != this.props.timeBudget)){
            this.setTime(this.props.timeBudget)
        }

        if((this.props.taskStatus == true) && (this.props.taskStatus != prevProps.taskStatus)){
            const interval = parseInt(this.state.timeBudget) * 10
            setInterval(this.updateProgress,interval);
            this.setState({status: "backward"})
        }
    }

    setTime = (timeBudget: string) => {
        const hr_seconds = 3600
        const min_seconds = 60

        let time = parseInt(timeBudget)
        let hours = Math.floor(time / hr_seconds)
        let minutes = hours == 0 ? time / min_seconds : time % hr_seconds
        let seconds = time < min_seconds ? time : 0

        this.setState({time: `PT${hours}H${minutes}M${seconds}S`, timeBudget: timeBudget})

    }

    updateProgress = () => {
        let { progress } = this.state;
        this.setState({progress: progress + 1})

        if(progress == 100){
            this.setState({status: false})
        }
    }

    render() {
        const { time, status, progress } = this.state
        const { taskLabel } = this.props
        return (
            <Box
                pad={{horizontal: "medium", bottom:"medium"}}>

                <Header background="none">
                    <Heading level={5}> Task Progress </Heading>
                    <Clock type="digital" time={time} run={status} />
                </Header>
                <Meter
                    values={[{
                        value: progress,
                        onClick: () => {}
                    }]}
                    aria-label="meter"
                    round={false}
                    background={"dark-4"}
                    size={"full"}
                />
                <Text size={"small"} margin={{top:"small"}}> {taskLabel} </Text>

            </Box>
        )
    }


}