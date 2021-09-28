import * as React from 'react';
import {
    Grid,
    Box,
    Sidebar,
    Grommet,
    Accordion,
    Anchor,
    AccordionPanel,
    Collapsible,
    Header,
    RadioButtonGroup,
    Text,
    CheckBoxGroup, Select, CheckBox, Heading
} from 'grommet';
import { Aggregate } from 'grommet-icons';

// import { XYPlot, MarkSeriesCanvas, MarkSeries, LabelSeries, Highlight, Hint,
//     XAxis, YAxis, VerticalGridLines, HorizontalGridLines }
//     from "react-vis";
import { XYPlot as RXYPlot } from "react-vis";
import { XAxis as RXAxis } from "react-vis";
import { YAxis as RYAxis } from "react-vis";
import { VerticalGridLines as RVerticalGridLines } from "react-vis";
import { HorizontalGridLines as RHorizontalGridLines } from "react-vis";
import { MarkSeries as RMarkSeries } from "react-vis";
import { Hint as RHint } from "react-vis";

// import { ParallelCoordinates } from "react-vis";
import ConfigPanel from "./components/panel/configuration/ConfigPanel";
import HeadPanel from "./components/panel/configuration/HeadPanel";
import HeadViz from "./components/panel/viz_dashboard/HeadViz";
import VizDashboard from "./components/panel/viz_dashboard/VizDashboard";
import HeadEval from "./components/panel/evaluation/HeadEval";
import EvaluationPanel from "./components/panel/evaluation/EvaluationPanel";
import {testFunction, disable} from "./service/DataService";
import { FORMATTED_CVI, REFORMATTED_CVI_OBJ } from "./constants/TaskConfiguration";

import ReactTooltip from 'react-tooltip';
import "./index.css";
import OutlinedBox from "./components/custom-grommet/OutlinedBox"
import OutlinedBoxPadded from "./components/custom-grommet/OutlinedBoxPadded";

import LineChartCustom, {LineChart2DCustom} from "./components/charts/linechart";
import {
  withHighcharts
} from 'react-jsx-highcharts';
import Highcharts from 'highcharts';
import BubbleCustom from "./components/charts/bubbler";

const jsonSort = require('json-keys-sort');
const colorType = 'typeA'

    const colorRanges = {
      typeA: ['#59E4EC', '#0D676C'],
      typeB: ['#EFC1E3', '#B52F93']
    };

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
    results: string
    currentCVIData: [any]
    currentPartition: string
    currentMetric: string
    value: any
    currentMetrics: []
    currentDisableState: boolean
    partitionDisableStatus: {}
    partitions: []
    partitionData: []
    bubbleChartData: []
    threeMetricsData: []
    twoMetricsData: []
    oneMetricData: []
    metricRanges: []
    currentDim: number
    metricData: []
    allPartitionData: {}
    domains: []
    partition: string
    pcaData: []
    rawData: []
    display: {}
    uploadedData: {}
    headerLabel: string
    headerPosition: any
    uploadedCSV: any

}

class App extends React.Component<{}, AppState> {
    private eventSource = new EventSource("http://0.0.0.0:5555/stream");

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
            algorithm: "DBSCAN",
            metric: "I-INDEX & MODIFIED-HUBERT-T & BANFELD-RAFERTY",
            partitions: [],
            partition: "None",
            partitionData: [],
            partitionDisableStatus: {},
            // @ts-ignore
            currentCVIData: [{'label': 'I-Index', 'value': 100, checked: false}, {'label': 'Silhouette', 'value': 20, checked: false}, {'label': 'McClainRao', 'value': 20, checked: false}],
            value: false,
            currentDisableState: false,
            currentPartition: "None",
            currentMetric: "",
            currentMetrics: [],
            bubbleChartData: [],
            currentDim: 1,
            oneMetricData: [],
            twoMetricsData: [],
            threeMetricsData: [],
            metricData: [],
            metricRanges: [],
            allPartitionData: {},
            domains: [],
            configuration: "None",
            results: "",
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
        this.eventSource = new EventSource(`http://0.0.0.0:5555/stream`);

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
            this.updateViewTaskRun()
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
            this.setState({metric: parsedData.metric[0]})
            // Set domain
            let domains = []
            let cviData = []
            var count = 0
            parsedData.metric[1].forEach(metric => {
                // @ts-ignore
                domains.push({
                     // @ts-ignore
                    name: metric[0],
                     // @ts-ignore
                    domain: [-300, 300]
                })

                cviData.push({
                    // @ts-ignore
                    label: REFORMATTED_CVI_OBJ[metric[0]][0],
                    // @ts-ignore
                    value: metric[0],
                    // @ts-ignore
                    checked: count == 0 ? true: false

                })

                count += 1
            })
            // @ts-ignore
            domains.push({name: 'generations', domain: [0, 100]})

            // @ts-ignore
            this.setState({domains: domains})
            // @ts-ignore
            this.setState({currentCVIData: cviData})
            // @ts-ignore
            this.setState({currentMetric: cviData[0].value})
            // @ts-ignore
            this.setState({currentMetrics: [cviData[0].value]})


        }else if("partitions" in parsedData){
            var altive = [];
            var motive = []
            var partitionStatus = {}
            var p;
            for (p in parsedData.partitions) {
                // @ts-ignore
                altive.push({'key': `P${p}`, 'label': parsedData.partitions[p]})
                // @ts-ignore
                motive.push(parsedData.partitions[p])
                // @ts-ignore
                partitionStatus[parsedData.partitions[p]] = false

            }

            // @ts-ignore
            this.setState({partitions: motive})
            this.setState({partitionDisableStatus: partitionStatus})
        }else if("partition_live" in parsedData){
            // @ts-ignore
            let pdata = parsedData.partition_live
            let label = pdata[0]

            // console.log("NEW PARTITION DATA")
            // console.log(pdata)
            // Update values for all partitions
            let allPartitionData = this.state.allPartitionData
            let domains = this.state.domains

            if (!Object.keys(allPartitionData).includes(label)){


                let allData = []
                pdata[1].forEach(evaluation => {

                    // let newPartitionData = {generations: evaluation[2], style: {fill: 'None'}}
                    let newPartitionData = {}
                    for(var i=0; i < evaluation[1].length; i++){

                        try{
                        // @ts-ignore
                            newPartitionData[domains[i].name] = evaluation[1][i]
                        }catch (e) {
                            console.log(e)
                        }

                    }
                    // @ts-ignore
                    allData.push(newPartitionData)
                })

                allPartitionData[label] = allData

                this.setState({allPartitionData})

            }else{
                var oldData = allPartitionData[label]
                let newData = []

                pdata[1].forEach(evaluation => {

                    let newPartitionData = {generations: evaluation[2], style: {fill: 'None'}}
                    for(var i=0; i < evaluation[1].length; i++){

                        // @ts-ignore
                        newPartitionData[domains[i].name] = evaluation[1][i]

                    }
                    // @ts-ignore
                    newData.push(newPartitionData)
                })

                newData = oldData.concat(newData)
                allPartitionData[label] = newData

                this.setState({allPartitionData})
            }

            const currentPartition = this.state.currentPartition
            if(currentPartition != "None"){
                this.onSelectPartition(currentPartition)
            }
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
        // this.updateViewTaskRun()

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

        this.setState({taskStatus: true})

        // // this.setTaskLabel("Getting recommended algorithm...");
        // // const payload = {"dataset": this.state.datasetName, "time": this.state.timeBudget}
        testFunction(payload).then(result => {
            // console.log(result)
            this.setState({
                configurations: result.data.clusters,
                results: result.data.configs,
                pcaData: result.data.pca,
                rawData: result.data.data
            })
        })
    }

    stopTaskRun = () => {
        //this.setState({taskStatus: false})

    }

     onChartSelect = (label, target) => {
        const checked = target.checked
        const cviData = this.state.currentCVIData

         // Render new graphs accordingly
         if (checked){
             // If new Chart to Render i.e. SELECTED
              let newCVIData = []
             cviData.forEach(entry => {
                 if (entry['label'].localeCompare(label) == 0){
                     newCVIData.push({
                         // @ts-ignore
                         label: entry['label'],
                         // @ts-ignore
                         value: entry['value'],
                         // @ts-ignore
                         checked: checked
                     })
                     console.log("ON CHART SELECT")
                     console.log(entry['label'], label)
                     let currentMetrics = this.state.currentMetrics
                     // @ts-ignore
                     currentMetrics.push(entry['value'])
                     // @ts-ignore
                     currentMetrics = [...new Set(currentMetrics)]
                     console.log(currentMetrics)
                     this.setState({currentMetrics})
                 }else{
                     newCVIData.push({
                         // @ts-ignore
                         label: entry['label'],
                         // @ts-ignore
                         value: entry['value'],
                         // @ts-ignore
                         checked: entry['checked']
                     })
                 }

             })
             //@ts-ignore
            this.setState({currentCVIData: newCVIData})

             let currentMetrics = this.state.currentMetrics
             //@ts-ignore
             let dim = parseInt(currentMetrics.length)

             // 2D Graph
             if (dim == 2){
                 this.display2D()
             }else if(dim === 3){ // 3D of Bubble Chart
                 this.setState({currentDim: 3})
                this.display3D()
             }
         }else{
             // DESELECTED

             this.removeMetric(label).then(newMetric => {
                 // let currentMetrics = this.state.currentMetrics
                 //@ts-ignore
                 let dim = parseInt(newMetric.length)


                 if(dim == 1){
                     this.setState({currentDim: 1})
                     const currentPartition = this.state.currentPartition
                     this.display1D(currentPartition)
                 }else if(dim == 2){
                     console.log("Oops -- 2D")
                    this.display2D()
                 }else{
                     console.log("Oops -- 3D")
                     this.display3D()
                 }
             })


         }

    }

    // Remove metric and uncheck
    removeMetric = async(metric) => {
        const allMetrics = this.state.currentMetrics
        let newMetrics = []
        metric = metric.trim().toLowerCase()
        allMetrics.forEach(m => {
            //@ts-ignore
            m = String(REFORMATTED_CVI_OBJ[m][0]).trim().toLowerCase()
            if(metric != m){
                newMetrics.push(m)
            }
        })
        //@ts-ignore
        this.setState({currentMetrics: newMetrics})


        return newMetrics
    }

    display1D = async(partition) => {
        const metrics = this.state.currentMetrics
        const currentPartition = this.state.currentPartition == "None" ? partition : this.state.currentPartition

        const allPartitions = this.state.allPartitionData

        try{
             let selected = allPartitions[currentPartition]
             let data = []
            selected.forEach(row => {
                // console.log(row)
                 let gen =  row["generations"]
                 if (gen == null || gen == "undefined"){
                     gen = 0
                 }else{
                     gen = parseInt(gen)
                 }
                 // @ts-ignore
                 data.push([gen, row[metrics[0]]])
            });
            // @ts-ignore
            this.setState({oneMetricData: data})
            this.setState({currentPartition: partition})
        }catch (e){
            console.log(e)
        }


    }

    display2D = async() => {
        const currentPartition = this.state.currentPartition
         const allPartitions = this.state.allPartitionData
         let metrics = this.state.currentMetrics

         let selected = allPartitions[currentPartition]
         let data = []
         // Create data for generations
         let maxGen = 0
         selected.forEach(row => {
             // console.log(row)
             let gen = row["generations"]
             if (gen == null) {
                 gen = 0
             } else {
                 gen = parseInt(gen)
             }
             if (gen > maxGen) {
                 maxGen = gen
             }
         })

         for (var i=0; i<=maxGen; i++){
             // @ts-ignore
             data.push([])
         }


         selected.forEach(row => {
            // console.log(row)
             let gen =  row["generations"]
             if (gen == null || gen == "undefined"){
                 gen = 0
             }else{
                 gen = parseInt(gen)
             }
             // @ts-ignore
             data[gen].push({x: row[metrics[0]], y: row[metrics[1]]})
        })
         // @ts-ignore
         this.setState({twoMetricsData: data})
         this.setState({currentDim: 2})


    }

    display3D = async() => {
        const currentPartition = this.state.currentPartition
         const allPartitions = this.state.allPartitionData
         let metrics = this.state.currentMetrics

         let selected = allPartitions[currentPartition]
        // console.log("3D Selected")
        // console.log(selected)
         let data = []
        let pdata = []
         // Create data for generations
         let maxGen = 0
         selected.forEach(row => {
             // console.log(row)
             let gen = row["generations"]
             if (gen == null) {
                 gen = 0
             } else {
                 gen = parseInt(gen)
             }
             if (gen > maxGen) {
                 maxGen = gen
             }
         })

         // for (var i=0; i<=maxGen; i++){
         //     // @ts-ignore
         //     data.push([])
         // }

         // Get [min, max] ranges for X/Y-Axis
        //@ts-ignore
        let m1_min = selected.map(function(el){return el[metrics[0]]}).reduce(function(el){return Math.min(el)});
        //@ts-ignore
        let m2_min = selected.map(function(el){return el[metrics[1]]}).reduce(function(el){return Math.min(el)});
        //@ts-ignore
        let m3_min = selected.map(function(el){return el[metrics[2]]}).reduce(function(el){return Math.min(el)});
        //@ts-ignore
        let m1_max = selected.map(function(el){return el[metrics[0]]}).reduce(function(el){return Math.max(el)});
        //@ts-ignore
        let m2_max = selected.map(function(el){return el[metrics[1]]}).reduce(function(el){return Math.max(el)});
        //@ts-ignore
        let m3_max = selected.map(function(el){return el[metrics[2]]}).reduce(function(el){return Math.max(el)});
        let m1_range = [0, m1_max*10]
        let m2_range = [m2_min, m2_max]
        let m3_range = [m3_min, m3_max]
        // console.log(m1_range)
        //@ts-ignore
        this.setState({metricRanges: [m3_range, m2_range, m1_range]})

        var colors = []
        var opacity = []
        for (var i =0; i <= maxGen; i++){
            // @ts-ignore
            colors.push(Math.random() * 10)
        }

         selected.forEach(row => {
            // console.log(row)
             let gen =  row["generations"]
             if (gen == null || gen == "undefined"){
                 gen = 0
             }else{
                 gen = parseInt(gen)
             }
             //@ts-ignore
             // pdata.push({metrics[2]: metrics[2]})

             // @ts-ignore
             // data[gen].push({x: this.sigmoid(row[metrics[2]]), y: this.sigmoid(row[metrics[1]]), size: row[metrics[0]]*10, label: `NGEN: ${gen}`})
             // data.push({x: row[metrics[2]], y: row[metrics[1]], size: row[metrics[0]] * 10, label: `NGEN: ${gen}`})
             data.push({
                // @ts-ignore
                 x: row[metrics[2]],
                // @ts-ignore
                 y: row[metrics[1]],
                // @ts-ignore
                 size:  parseInt((row[metrics[0]]/m1_max) * 10),
                // @ts-ignore
                 color: colors[gen],
                // @ts-ignore
                 label: `NGEN: ${gen}`
                // @ts-ignore
                //   opacity: Math.random() * 0.5 + 0.5
             })
        })
        console.log("DATA sent to plot")
        console.log(data)
         // @ts-ignore
         this.setState({threeMetricsData: data})
         this.setState({currentDim: 3})


    }

    onSelectMetric = async(metric: string) => {
        const allPartitions = this.state.allPartitionData
        const currentPartition = this.state.currentPartition

        console.log("Changed Metric: ", metric)
        if(currentPartition != "None"){
            let selected = allPartitions[currentPartition]
            let metricData = []
            selected.forEach(part => {
                // @ts-ignore
                metricData.push([part['generations'], part[metric]])
            })
            //@ts-ignore
            this.setState({metricData: metricData})
            this.setState({currentMetric: metric})
        }
    }

    onDisablePartition = async(checked) => {
        console.log("Is Checked? ", checked)
        const currentPartition = this.state.currentPartition
        console.log("Attempt to disable partition: ", currentPartition)
        let partitionStates = this.state.partitionDisableStatus
        partitionStates[currentPartition] = !checked
        this.setState({currentDisableState: !checked})
        this.setState({partitionDisableStatus: partitionStates})

        disable({pid: 57}).then(result => {
            // console.log(result)
            // this.setState({configurations: result.data.clusters, pcaData: result.data.pca, rawData: result.data.data})
        })

    }

    onSelectPartition = async(partition: string) => {

        this.setState({partition})
        const allPartitions = this.state.allPartitionData
        this.display1D(partition)

        //@ts-ignore
        this.setState({partitionData: allPartitions[partition]})


        // this.refreshParallelCoordinate(partition)
    }

    sigmoid = (t) => {
        t = parseFloat(t)
        return 1/(1+Math.pow(Math.E, -t));
    }

    refreshParallelCoordinate = async(partition: string)=> {
        // @ts-ignore
        if (partition.length < 8){
             var tee = [{
                        i_index: 10,
                        modified_hubert_t: 50,
                        banfeld_raferty: 35,
                        generations: 1,
                          style: {
                            fill: 'None'
                          }
                      }]
        // @ts-ignore
            this.setState({partitionData: tee})
        }


    }

    public render() {



        const { display, headerLabel, headerPosition, partitions, partition,
            currentMetric, metricRanges, currentCVIData, currentDisableState,
        currentMetrics, currentDim, twoMetricsData,
        oneMetricData, threeMetricsData, value} = this.state


         // !! DELETE !!
        const markSeriesProps = {
          animation: true,
          className: 'mark-series-example',
            // @ts-ignore
          sizeRange: metricRanges[2],
          seriesId: 'my-example-scatterplot',
          colorRange: colorRanges[colorType],
          opacityType: 'literal',
          data: threeMetricsData,
          onNearestXY: value => this.setState({value}),
          // onValueMouseOver: (datapoint, event) =>{
          //       // does something on click
          //       // you can access the value of the event
          //               console.log(datapoint)
          //     }
          }
          // !! DELETE !!



        const render1D = () => {
            if (currentDim == 1){
                console.log("State changed: ", 1)
                //@ts-ignore
                return <LineChartCustom data={[oneMetricData, currentMetrics[0]]}/>
            }else if (currentDim == 2){
                console.log("State changed: ", 2)
                return <LineChart2DCustom data={[twoMetricsData, currentMetrics]}/>
            }else{
                console.log("State changed: ", 3)
                console.log(currentMetrics)

                // return (
                //     <div className="canvas-wrapper">
                //         <RXYPlot
                //           onMouseLeave={() => this.setState({value: false})}
                //           width={500}
                //           height={300}
                //         >
                //           <RVerticalGridLines />
                //           <RHorizontalGridLines />
                //           // @ts-ignore
                //           <RXAxis title={REFORMATTED_CVI_OBJ[currentMetrics[2]][0] + " (" + REFORMATTED_CVI_OBJ[currentMetrics[2]][2] + ")"}/>
                //           <RYAxis title={REFORMATTED_CVI_OBJ[currentMetrics[1]][0] + " ("  + REFORMATTED_CVI_OBJ[currentMetrics[1]][2] + ")"}  />
                //           <RMarkSeries {...markSeriesProps} />
                //           {/*{value ? <RHint value={value} /> : null}*/}
                //         </RXYPlot>
                //         </div>
                // );

                // @ts-ignore
                return <BubbleCustom {...this.state}/>
                // return <BubbleCustom data={[threeMetricsData, currentMetrics, metricRanges]}/>
                // return <LineChart2DCustom data={[threeMetricsData, currentMetrics]}/>
            }
        }
        // @ts-ignore
        // @ts-ignore
        // @ts-ignore
        // @ts-ignore
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
                                <OutlinedBoxPadded gridArea={"main"}>
                                    <Accordion>
                                  <AccordionPanel label="Visualize Features">
                                    <Box pad="medium">
                                      {/*<HeadViz/>*/}
                                        <VizDashboard
                                            {...this.state}
                                            setUploadedData={this.setUploadedData}
                                        />
                                    </Box>
                                  </AccordionPanel>
                                  <AccordionPanel label="Hyper-Partitions">
                                    {/*<Box pad="medium">*/}
                                    {/*  <Text>Algorithm not selected</Text>*/}
                                    {/*</Box>*/}
                                      <Box pad="medium">

                                        {/*  <Box>*/}
                                        {/*       <CheckBoxGroup*/}
                                        {/*    options={partitions}*/}
                                        {/*/>*/}
                                        {/*  </Box>*/}

                                        <Box direction={"row"}>
                                            <Box>
                                                <Select
                                                options={partitions}
                                                value={partition}
                                                placeholder={"Select a partition"}
                                                onChange={({ option }) => this.onSelectPartition(option)}
                                            />
                                            </Box>

                                            {partition != "None" ? (
                                                 <Box pad={"small"}>
                                                <CheckBox
                                                  checked={currentDisableState}
                                                  label="Disable Partition"
                                                  onChange={(event) => this.onDisablePartition(event.target.checked)}
                                                />

                                            </Box>
                                            ): (
                                                <br/>
                                            )}



                                        </Box>


                                          {oneMetricData.length > 0 ? (
                                              <Box>
                                                  <Box margin={"small"}>
                                                      <Heading level={4} margin={"small"}> Select Metric to Visualize </Heading>
                                                      {/*<Box>*/}
                                                      {/*    <CheckBox*/}
                                                      {/*        checked={false}*/}
                                                      {/*        //@ts-ignore*/}
                                                      {/*        label={currentCVIData[0]['label']}*/}
                                                      {/*        onChange={(event) => this.onChartSelect(event.target)}*/}
                                                      {/*      />*/}
                                                      {/*</Box>*/}
                                                    {/*<RadioButtonGroup*/}
                                                    {/*  name="radio"*/}
                                                    {/*  direction="row"*/}
                                                    {/*  align="center"*/}
                                                    {/*  options={currentCVIData}*/}
                                                    {/*  value={currentMetric}*/}
                                                    {/*  //@ts-ignore*/}
                                                    {/*  onChange={event => this.onSelectMetric(event.target.value)}*/}

                                                    {/*/>*/}

                                                      <Box direction={"row"} gap={"medium"}>
                                                              <CheckBox
                                                                   //@ts-ignore
                                                                  checked={currentCVIData[0]['checked']}
                                                                  //@ts-ignore
                                                                  label={currentCVIData[0]['label']}
                                                                  onChange={(event) => this.onChartSelect(currentCVIData[0]['label'], event.target)}
                                                                />
                                                                <CheckBox
                                                                   //@ts-ignore
                                                                  checked={currentCVIData[1]['checked']}
                                                                  //@ts-ignore
                                                                  label={currentCVIData[1]['label']}
                                                                  //@ts-ignore
                                                                  onChange={(event) => this.onChartSelect(currentCVIData[1]['label'], event.target)}
                                                                />
                                                                <CheckBox
                                                                    //@ts-ignore
                                                                  checked={currentCVIData[2]['checked']}
                                                                  //@ts-ignore
                                                                  label={currentCVIData[2]['label']}
                                                                  //@ts-ignore
                                                                  onChange={(event) => this.onChartSelect(currentCVIData[2]['label'], event.target)}
                                                                />
                                                          </Box>
                                                  </Box>

                                                  {render1D()}
                                              </Box>

                                          ): (
                                              <br/>

                                          )}
                                      </Box>
                                  </AccordionPanel>
                                </Accordion>
                                </OutlinedBoxPadded>


                                {/*<OutlinedBoxPadded gridArea="main">*/}
                                {/*    <HeadViz/>*/}
                                {/*    <VizDashboard*/}
                                {/*        {...this.state}*/}
                                {/*        setUploadedData={this.setUploadedData}*/}
                                {/*    />*/}

                                {/*</OutlinedBoxPadded>*/}

                                {/*<OutlinedBoxPadded gridArea="main">*/}
                                {/*    <HeadViz/>*/}

                                {/*</OutlinedBoxPadded>*/}
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
    accordion: {
        icons: {
            color: "#7D4CDB"
        },
        border: {
            color: "#7D4CDB"
        },
      }
};

export default withHighcharts(App, Highcharts);
