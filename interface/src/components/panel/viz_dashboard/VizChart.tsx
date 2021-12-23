import * as React from 'react';
import { Paragraph, Box, Select, Heading} from 'grommet';
import {getStaticCSVFile, XDataSetSummary} from "../../../service/DataService";

import { withHighcharts, HighchartsChart, Chart, XAxis, YAxis, Title, Subtitle, Legend, LineSeries, BoxPlotSeries } from 'react-jsx-highcharts';
import { ParallelCoordinates } from "react-vis";

import Highcharts from 'highcharts';

// import HighchartsReact from 'highcharts-react-official';
import { Bar } from 'react-chartjs-2'; // remove package

import addHighchartsMore from 'highcharts/highcharts-more';

import "./VizChart.css";

addHighchartsMore(Highcharts);


const papa = require("papaparse")


export interface VizChartProps {
    datasetName: string
    uploadedCSV: any
    uploadedData: {}
    setUploadedData: (uploadedData: {}) => void;
}

export interface VizChartState{
    dataset: {}
    features: any[]
    feature: string
    datasetSummary : XDataSetSummary[]

}

export interface XFeature{
    name: string
    data: any[]
}

class VizChart extends React.Component<VizChartProps, VizChartState>{

    constructor(props: VizChartProps) {
        super(props);
        this.state = {
            dataset: {},
            features: [],
            feature: "",
            datasetSummary: [{name: "", n_classes: 0, n_instances: 0, n_features: 0}]
        }
    }

    componentDidUpdate = (prevProps: VizChartProps, prevState: VizChartState) => {
        if((prevProps.datasetName != this.props.datasetName) && (this.props.uploadedCSV == "None")){
            this.getCSVData(this.props.datasetName);
        }

        if(prevProps.uploadedCSV != this.props.uploadedCSV){
            this.getUploadedCSV()
        }
    }


    onSelectFeature = async(feature: string) => {
        this.setState({feature: feature})
    }

    parseCSVData = (csv) => {
        let output = csv.data

        // Get Features
        const nr_features = output[0].length - 1
        let features = []
        for(let i=1; i <= nr_features; i++){
            // @ts-ignore
            features.push(`V${i}`)
        }

        // Group values by features for boxplot visualization
        let dataset = {}
        let nr_instances = 0
        let classes = []
        output.forEach(row => {
            for(let i=1; i <= nr_features; i++){
                // @ts-ignore
                let key = "V"+i
                let value = parseFloat(row[i-1])
                if(dataset[key]){
                    let temp_array = dataset[key]
                    temp_array.push(value)
                    dataset[key] = temp_array
                }else{
                    dataset[key] = [value]
                }

            }
            nr_instances += 1
            // @ts-ignore
            classes.push(parseInt(row[nr_features]))

        });

        // @ts-ignore
        let distinctClasses = [...new Set(classes)];
        const nr_classes = distinctClasses.length;

        this.setState({
            datasetSummary: [{name: this.props.datasetName, n_features: nr_features, n_instances: nr_instances, n_classes: nr_classes}],
            features: features,
            feature: features[0],
            dataset: dataset
        });

        this.props.setUploadedData(dataset)

    }

    getUploadedCSV = () => {
        const { uploadedCSV } = this.props
        papa.parse(uploadedCSV, {
            complete: this.parseCSVData
        });
    }

    getCSVData = async(dataset: string) => {
        let data = await getStaticCSVFile(dataset);
        papa.parse(data, {
            complete: this.parseCSVData
        });

    }

    render() {
        const { feature, features, dataset, datasetSummary } = this.state

        return(
            <Box>
                <Box
                    pad="medium"
                    align={"stretch"}
                    alignContent={"stretch"}
                    border={{side: "bottom", color: "brand", size: "xsmall", style: "solid"}}>

                    <Box
                        direction="column"
                        align={"start"}
                        pad={{"bottom":"medium"}}>
                        <Select
                            options={features}
                            value={feature}
                            placeholder={"Select a feature"}
                            onChange={({ option }) => this.onSelectFeature(option)}
                        />
                    </Box>

                    <Box
                        align={"center"}
                    >
                        <HighchartsChart>
                            <Chart
                                height={400}
                                width={600}
                                type={"spline"}
                                backgroundColor="transparent"
                                inverted={true} />
                            <Title>Feature Distribution</Title>


                            <XAxis>
                                <XAxis.Title></XAxis.Title>
                            </XAxis>

                            <YAxis id="number">
                                <YAxis.Title></YAxis.Title>
                                <BoxPlotSeries id="1" name="L1" data={[
                                    dataset[feature]

                                ]} />
                            </YAxis>
                        </HighchartsChart >



                    </Box>

                </Box>

                {/*<Box pad="medium">*/}
                {/*    <Heading level={4}> Dataset Summary </Heading>*/}
                {/*    <Paragraph margin={"none"}> Number of Instances: {datasetSummary[0].n_instances} </Paragraph>*/}
                {/*    <Paragraph margin={"none"}> Number of Features: {datasetSummary[0].n_features} </Paragraph>*/}
                {/*    <Paragraph margin={"none"}> Classes / Clusters: {datasetSummary[0].n_classes} </Paragraph>*/}
                {/*</Box>*/}

            </Box>


        )
    }


}

export default  withHighcharts(VizChart, Highcharts)

