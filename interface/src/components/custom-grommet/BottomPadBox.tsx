import { Box } from "grommet";
import styled from "styled-components";
import * as React from "react";
import "./custom-styles.css"


export default function BottomPadBox(props) {
    return (
        <Box pad={{"bottom": "medium"}} gap={"small"}>
            {props.children}
        </Box>
    )
}