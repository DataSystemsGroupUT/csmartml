import { Box } from "grommet";
import styled from "styled-components";
import * as React from "react";
import "./custom-styles.css"


export default function OutlinedBoxPadded(props) {
    return (
        <Box className={"outlined-box"} fill={"vertical"} overflow={"auto"} pad={"small"}>
            {props.children}
        </Box>
    )
}