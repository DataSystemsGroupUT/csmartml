import * as React from 'react';
import {Heading, Select, TextInput} from 'grommet';
import ParamBox from "./ParamBox";

export interface TimeBudgetProps {
    timeBudget: string
    setTimeBudget: (timeBudget: string) => void;

}

export default class TimeBudget extends React.Component<TimeBudgetProps, {}>{
    constructor(props: TimeBudgetProps) {
        super(props);
    }

    setTimeBudget = (timeBudget) => {
        this.props.setTimeBudget(timeBudget);
    }


    render() {
        const { timeBudget } =  this.props;

        return(
            <ParamBox>
                <Heading level={5} margin="none"> Time Budget (in seconds) </Heading>
                <TextInput
                    placeholder={"Enter time budget"}
                    value={ timeBudget }
                    onChange = {event => this.setTimeBudget(event.target.value)}
                />
                {/*<Select*/}
                {/*    options={['10', '60', '300', '600', '1800', '3600']}*/}
                {/*    value={ timeBudget }*/}
                {/*    placeholder={"Tap to choose"}*/}
                {/*    onChange={({ option }) => this.setTimeBudget(option)}*/}
                {/*/>*/}
            </ParamBox>
        );
    }


}

