import * as React from 'react';
import {Header,Heading, Box} from 'grommet';
import ReactTooltip from 'react-tooltip';

function HeadPanel(){
    const label = "Select dataset, time budget, algorithms and <br />other parameters for your auto-clustering task"
    return(
        <Header background="neutral-2">
            <Box pad="small">
                <Heading margin="none" level={4} data-tip={label}> Set Task Configuration </Heading>
            </Box>
            <ReactTooltip  place="bottom" multiline={true}/>
        </Header>

    )
}

export default HeadPanel;