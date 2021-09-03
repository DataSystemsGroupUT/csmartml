import * as React from 'react';
import {
    Grid,
    Box,
    Sidebar,
    Grommet,
    Accordion,
    Anchor,
    AccordionPanel, Collapsible, Header
} from 'grommet';
import { Aggregate } from 'grommet-icons';


import ConfigPanel from "./components/panel/configuration/ConfigPanel";
import HeadPanel from "./components/panel/configuration/HeadPanel";
import HeadViz from "./components/panel/viz_dashboard/HeadViz";
import VizDashboard from "./components/panel/viz_dashboard/VizDashboard";
import HeadEval from "./components/panel/evaluation/HeadEval";
import EvaluationPanel from "./components/panel/evaluation/EvaluationPanel";
import {testFunction} from "./service/DataService";
import { FORMATTED_CVI } from "./constants/TaskConfiguration";

import ReactTooltip from 'react-tooltip';
import "./index.css";
import OutlinedBox from "./components/custom-grommet/OutlinedBox"
import OutlinedBoxPadded from "./components/custom-grommet/OutlinedBoxPadded";

const jsonSort = require('json-keys-sort');

export interface AppState{
    datasetName: string
    timeBudget: string
    taskStatus: boolean
    taskLabel: string
    algorithm: string
    metric: string
    resultPreference: string
    metaLearning: boolean
    configurations: {}
    configuration: string
    pcaData: []
    rawData: []
    display: {}
    uploadedData: {}
    headerLabel: string
    headerPosition: any
    uploadedCSV: any

}

class App extends React.Component<{}, AppState> {
    private eventSource = new EventSource("http://0.0.0.0:5000/stream");

    constructor(props: {}) {
        super(props);
        this.startTaskRun = this.startTaskRun.bind(this);
        this.state = {
            datasetName: "None",
            uploadedCSV: "None",
            timeBudget: "600",
            taskStatus: false,
            metaLearning: true,
            taskLabel: "Not Started",
            algorithm: "db",
            metric: "cvi-102",
            configuration: "None",
            resultPreference: "multi",
            configurations: {},
            uploadedData: {},
            pcaData: [],
            rawData: [],
            display: {
                rows: ["xsmall", "large"],
                // columns: ["medium", "flex", "flex"],
                columns: ["medium"],
                gap: "small",
                pad: {"top": "small"},
                areas: [
                    ['header'],
                    ['nav']
                    // {name: 'nav', start: [0, 0], end: [0, 0]},
                    // {name: 'main', start: [1, 0], end: [1, 0]},
                    // {name: 'results', start: [2, 0], end: [2, 0]}
                ],
                collapseMain: false,
                collapseEval: false,

            },
            headerLabel: "CSmartML",
            headerPosition: "start"
        }
    }

    componentDidMount = () => {
        this.eventSource = new EventSource(`http://0.0.0.0:5000/stream`);

        // Grab all events with the type of 'message'
        this.eventSource.addEventListener('message', (data) => {
            this.liveTaskUpdates(data);
        });

    }

    componentWillUnmount = () => {
        // this.eventSource.removeEventListener();
        this.eventSource.close();

    }

    componentDidUpdate(prevProps: {}, prevState: AppState) {
        if(prevState.configurations != this.state.configurations){
            // Set default configuration
            let firstKey = Object.keys(this.state.configurations)[0]
            this.setState({configuration: firstKey})
        }

        if((prevState.datasetName != this.state.datasetName) && (prevState.datasetName == "None")){
           this.updateViewTaskViz()
        }
    }

    updateViewTaskViz = () => {
        let { display } = this.state
        display["columns"] = ["medium", "large"]
        display["areas"] = [["header", "header"], ["nav", "main"]]
        display["collapseMain"] = true

        const extLabel = "CSmartML: Automated Machine Learning Tool for Clustering"
        this.setState({display: display, headerLabel:extLabel})
    }

    updateViewTaskRun = () => {
        let { display } = this.state
        display["collapseEval"] = true
        display["columns"] = ["medium", "flex", "flex"]
        display["areas"] = [["header", "header", "header"], ["nav", "main", "results"]]
        this.setState({display: display, headerPosition: "center"})

    }

    liveTaskUpdates = (data) => {
        let parsedData = JSON.parse(data.data)
        this.setTaskLabel(parsedData.label);
        if("algorithm" in parsedData){
            this.setState({algorithm: parsedData.algorithm})
        }else if("metric" in parsedData){
            this.setState({metric: parsedData.metric})
        }
    }

    setTaskLabel = (taskLabel: string) => {
        this.setState({taskLabel: taskLabel})
    }

    setCSVFile = (csvfile) => {
        this.setState({uploadedCSV: csvfile})
    }

    setDatasetName = (datasetName: string) => {
        this.setState({datasetName: datasetName})
    }

    setTimeBudget = (timeBudget: string) => {
        this.setState({timeBudget: timeBudget});
    }

    setAlgorithm = (algorithm: string) => {
        this.setState({algorithm});
    }

    setMetric = (metric: string) => {
        this.setState({metric});
    }

    setUploadedData = (uploadedData: {}) => {
        this.setState({uploadedData})
    }

    toggleMetaLearning = (metaLearning: boolean) => {
        this.setState({metaLearning: metaLearning})
    }

    setResultPreference = (resultPreference: string) => {
        this.setState({resultPreference})
    }


    startTaskRun = () => {
        // Load Evaluation panel
        this.updateViewTaskRun();

        // Get payload for Python Server
        const { metaLearning, algorithm, metric, uploadedData, uploadedCSV, resultPreference, datasetName, timeBudget } = this.state
        let payload = metaLearning ?
            {} : {"algorithm": algorithm, "metric": FORMATTED_CVI[metric]};

        if(uploadedCSV != "None"){
            payload["ud"] = uploadedData
        }

        payload["dataset"] = datasetName
        payload["time"] = timeBudget
        payload["result"] = resultPreference
        // this.setState({taskStatus: true})
        // this.setTaskLabel("Getting recommended algorithm...");
        // const payload = {"dataset": this.state.datasetName, "time": this.state.timeBudget}
        testFunction(payload).then(result => {
            // console.log(result)
            this.setState({configurations: result.data.clusters, pcaData: result.data.pca, rawData: result.data.data})
        })
    }

    stopTaskRun = () => {
        //this.setState({taskStatus: false})

    }

    public render() {
        const { display, headerLabel, headerPosition } = this.state
        return (

            <Grommet theme={theme}>
                    <Box
                        pad="medium"
                        fill="vertical"
                        align={'center'}
                    >
                        <Grid
                            rows={display["rows"]}
                            columns={display["columns"]}
                            gap={display["gap"]}
                            pad={display["pad"]}
                            areas={display["areas"]}
                        >

                            <Box gridArea="header" background="neutral-2">

                                <Header background="neutral-2" pad="medium" height="xsmall" alignSelf={headerPosition}>
                                    <Anchor
                                        href="#"
                                        icon={<Aggregate color="light-1" />}
                                        label={headerLabel}
                                        size={"xlarge"}
                                    />
                                </Header>


                            </Box>

                            <Collapsible open={true}>

                                {/* Configuration Panel */}

                                <OutlinedBox gridArea="nav">
                                    <Sidebar background="#fff">
                                        <HeadPanel/>
                                        <ConfigPanel
                                            {...this.state}
                                            setDatasetName={this.setDatasetName}
                                            setTimeBudget={this.setTimeBudget}
                                            startTaskRun={this.startTaskRun}
                                            setCSVFile={this.setCSVFile}
                                            setMetric = {this.setMetric}
                                            setAlgorithm = {this.setAlgorithm}
                                            toggleMetaLearning={this.toggleMetaLearning}
                                            setResultPreference={this.setResultPreference}
                                        />
                                    </Sidebar>
                                </OutlinedBox>

                            </Collapsible>



                            <Collapsible open={display["collapseMain"]} direction={"horizontal"}>

                                {/* Dataset Visualization Panel */}

                                <OutlinedBoxPadded gridArea="main">
                                    <HeadViz/>
                                    <VizDashboard
                                        {...this.state}
                                        setUploadedData={this.setUploadedData}
                                    />

                                </OutlinedBoxPadded>

                            </Collapsible>


                            <Collapsible open direction={"horizontal"}>

                                {display["collapseEval"] && (
                                    // <Box gridArea="results" background="light-1" pad="small" fill={"vertical"}>
                                    <OutlinedBoxPadded gridArea="results">
                                        <HeadEval/>
                                        <EvaluationPanel
                                            {...this.state}
                                            setTimeBudget={this.setTimeBudget}
                                            setTaskLabel={this.setTaskLabel}
                                        />
                                    </OutlinedBoxPadded>
                                )}



                             </Collapsible>






                        </Grid>

                    </Box>




            </Grommet>

        )
    }

}

const theme = {
  global: {
    font: {
      family: 'Rubik'
    },
  },
};

export default App;
