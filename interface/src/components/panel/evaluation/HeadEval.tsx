import * as React from 'react';
import {Box, Header, Heading} from "grommet";

function HeadEval(){
    return(
        <Header background="neutral-2">
            <Box pad="small">
                <Heading margin="none" level={4}> Evaluation </Heading>
            </Box>
        </Header>
    )
}

export default HeadEval;