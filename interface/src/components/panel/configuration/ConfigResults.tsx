import * as React from 'react';
import {Box, Heading, Select} from 'grommet';
import { RESULT_PREFERENCE } from "../../../constants/TaskConfiguration";

interface ConfigResultsProps {
    resultPreference: string
    setResultPreference: (resultPreference: string) => void;
}

interface ConfigResultsState {
    preferenceList: any []
}

export default class ConfigResults extends React.Component< ConfigResultsProps, ConfigResultsState>{

    constructor(props: ConfigResultsProps) {
        super(props);
        this.state = {
            preferenceList: RESULT_PREFERENCE
        }

    }

    onSelectResultPreference(resultPreference: string){
        this.props.setResultPreference(resultPreference)
    }

    render() {
        const { preferenceList } = this.state
        const { resultPreference } = this.props
        const label = "Get a single best configuration or multiple optimal solutions"

        return(
            <Box pad="medium" gap="small"
                 border={{side: "bottom", color: "brand", size: "xsmall", style: "solid"}}>
                <Heading margin="none" level={5} data-tip={label} data-place={"right"}> Result Preference </Heading>
                <Select
                    options={preferenceList}
                    value={resultPreference}
                    labelKey={"label"}
                    valueKey={{key: "value", reduce: true}}
                    onChange={({ value: nextValue }) => this.onSelectResultPreference(nextValue)}
                />
            </Box>
        )
    }

}

