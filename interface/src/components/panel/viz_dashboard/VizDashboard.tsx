import * as React from 'react';
import VizChart from "./VizChart";
import {Box} from "grommet";
import {XDataSetSummary} from "../../../service/DataService";

export interface VizDashboardProps{
    datasetName: string
    uploadedData: {}
    setUploadedData: (uploadedData: {}) => void;

}

export interface VizDashboardState{
    dataset: string
}

export default class VizDashboard extends React.Component<VizDashboardProps, VizDashboardState> {
    constructor(props: VizDashboardProps) {
        super(props);
    }

    render(){
        return(
            <VizChart {...this.props}/>
        );
    }
}