import { Box } from "grommet";
import styled from "styled-components";
import * as React from "react";
import "./custom-styles.css"


export default function OutlinedBox(props) {
   return (
       <Box className={"outlined-box"} fill={"vertical"} overflow={"auto"}>
           {props.children}
       </Box>
   )
}