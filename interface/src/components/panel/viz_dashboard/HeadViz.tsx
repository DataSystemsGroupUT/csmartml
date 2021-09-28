import * as React from 'react';
import { Header,Heading, Box } from 'grommet';

function HeadViz(){
    return(
        <Header background="neutral-2">
            <Box pad="small">
                <Heading margin="none" level={4}> Visualize Dataset </Heading>
            </Box>
        </Header>
    )
}

export default HeadViz;