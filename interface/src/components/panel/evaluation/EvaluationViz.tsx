import * as React from 'react';
import {Box, Clock, Header, Heading, Select, Button} from 'grommet';
import { Save } from 'grommet-icons';
import { withHighcharts, HighchartsChart, Chart, XAxis, YAxis, ScatterSeries } from 'react-jsx-highcharts';
import Highcharts from 'highcharts';


import addHighchartsMore from 'highcharts/highcharts-more';


addHighchartsMore(Highcharts);


const papa = require("papaparse")


export interface EvaluationVizProps {

    configuration: string
    configurations: {}
    pcaData: []
    rawData: []
}

export interface EvaluationVizState{

    configuration: string
    configuration_names: any []
    selected_configuration: {}

}


class EvaluationViz extends React.Component<EvaluationVizProps, EvaluationVizState>{

    constructor(props: EvaluationVizProps) {
        super(props);
        this.state = {
            configuration: this.props.configuration,
            configuration_names: Object.keys(this.props.configurations),
            selected_configuration: {}
        }
    }

    componentDidUpdate = (prevProps: EvaluationVizProps, prevState: EvaluationVizState) => {

        if(prevProps.configurations != this.props.configurations){
            this.setState({configuration_names: Object.keys(this.props.configurations)})
        }
        if(prevProps.configuration != this.props.configuration){
            this.onSelectConfiguration(this.props.configuration);
        }

    }


    onSelectConfiguration = async(configuration: string) => {
        this.setState({configuration: configuration})
        this.parseClusteredJSON(this.props.configurations[configuration], this.props.pcaData)
    }

    parseClusteredJSON = (jsonClusters, jsonPCA) => {

        let data_by_cluster = {}

        let i = 0
        // Group data by clusters
        jsonPCA.forEach(row => {
            let key = "C" + jsonClusters[i]

            if(data_by_cluster[key]){
                let temp_array = data_by_cluster[key]
                temp_array.push([row[0], row[1]])
                data_by_cluster[key] = temp_array
            }else{
                data_by_cluster[key] = [row[0], row[1]]
            }

            i += 1
        });

        // console.log(data_by_cluster)
        this.setState({selected_configuration: data_by_cluster})

    }

    saveClusteredData = () => {

        const { configuration, rawData } = this.props
        const jsonClusters = this.props.configurations[configuration]

        let jsonCombinedData = []
        // @ts-ignore
        const nr_features = rawData[0].length - 1
        let j = 0

        rawData.forEach(row => {
            let temp_array = []

            for(let i=0; i <= nr_features; i++){
                // @ts-ignore
                temp_array.push(row[i])
            }
            // Add cluster label
            // @ts-ignore
            temp_array.push(jsonClusters[j])

            // @ts-ignore
            jsonCombinedData.push([temp_array])

            j += 1

        });


        // Create file download function
        const csv = papa.unparse(jsonCombinedData)
        let blob = new Blob([csv]);
        let a = window.document.createElement("a");
        // @ts-ignore
        a.href = window.URL.createObjectURL(blob, {type: "text/plain"});
        a.download = "csmartml-" + configuration + ".csv";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);


    }




    render() {
        const { configuration, configuration_names, selected_configuration } = this.state


        const scatter_series = []
        const colors = ["rgba(128,0,0,1)", "rgba(255,215,0, 1)", "rgba(34,139,34, 1)", "rgba(0,128,128, 1)", "rgba(95,158,160, 1)", 'rgba(139,0,139, 1)']
        let idx = 0
        for(var key in selected_configuration){
            // @ts-ignore
            let temp_data = selected_configuration[key]
            let data = []
            temp_data.forEach(row => {
                // @ts-ignore
                data.push([row[0], row[1]])
            });

            // @ts-ignore
            scatter_series.push(<ScatterSeries data={data} color={colors[idx]} />)
            idx += 1

        }

        return(
            <Box>
                <Box
                    pad="small"
                    align={"start"}
                    alignContent={"center"}
                    border={{side: "bottom", color: "brand", size: "xsmall", style: "solid"}}>

                    <Header background="none">
                        <Select
                            options={configuration_names}
                            value={configuration}
                            placeholder={"Select a solution"}
                            onChange={({ option }) => this.onSelectConfiguration(option)}
                        />
                        <Button icon={<Save />}
                                label='Labeled Dataset'
                                onClick={this.saveClusteredData}
                                href='#' />
                    </Header>
                    {/*</Header>*/}
                    {/*<Box*/}
                    {/*    direction="column"*/}
                    {/*    align={"start"}*/}
                    {/*    pad={{"bottom":"medium"}}>*/}
                    {/*    <Select*/}
                    {/*        options={configuration_names}*/}
                    {/*        value={configuration}*/}
                    {/*        placeholder={"Select a solution"}*/}
                    {/*        onChange={({ option }) => this.onSelectConfiguration(option)}*/}
                    {/*    />*/}
                    {/*</Box>*/}

                    <Box
                        align={"stretch"}
                    >
                        <HighchartsChart>
                            <Chart height={300} backgroundColor="transparent" />


                            <XAxis>
                                <XAxis.Title></XAxis.Title>
                            </XAxis>

                            <YAxis id="number">
                                <YAxis.Title></YAxis.Title>
                                {scatter_series}
                                {/*<ScatterSeries data={[[161.2, 51.6], [167.5, 59.0], [159.5, 49.2]]} />*/}
                                {/*<ScatterSeries data={[[170.0, 59.0], [159.1, 47.6], [166.0, 69.8]]} color={'rgba(223, 83, 83, 1)'}/>*/}

                            </YAxis>
                        </HighchartsChart >
                    </Box>

                </Box>

            </Box>


        )
    }


}

export default  withHighcharts(EvaluationViz, Highcharts)

