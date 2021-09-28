import * as React from 'react';
import { Box } from 'grommet';

function ParamBox(props){
    return(
         <Box pad="medium" gap="small"
             border={{side: "bottom", color: "neutral-2", size: "xsmall", style: "solid"}}>
             {props.children}
         </Box>
    )
}

export default ParamBox;