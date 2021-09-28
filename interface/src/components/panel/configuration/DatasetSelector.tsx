import * as React from "react";
import { Heading, Select, TextInput } from "grommet";
import { DocumentCsv } from "grommet-icons";
import ParamBox from "./ParamBox";
import { getStaticCSVFile } from "./../../../service/DataService"
// import * as csv from "fast-csv"; // remove package

const papa = require("papaparse")


export interface DatasetSelectorProps{
    datasetName: string
    uploadedCSV: any
    setDatasetName: (datasetName: string) => void;
    setCSVFile: (csvfile: any) => void;

}

export interface DatasetSelectorState{
    dataset: string,
}


export default class DatasetSelector extends React.Component<DatasetSelectorProps, DatasetSelectorState> {

    constructor(props: DatasetSelectorProps) {
        super(props);
        this.onSelectDataset = this.onSelectDataset.bind(this);
        this.state = {
            dataset: "None",
        }
    }

    componentDidUpdate = (prevProps: DatasetSelectorProps, prevState: DatasetSelectorState) => {
        if(prevProps.datasetName != this.props.datasetName){
            console.log("[DatasetSelector]: Component updated")
        }
    }

    onSelectDataset = async(dataset: string) => {
        this.props.setDatasetName(dataset);
        this.props.setCSVFile("None")

    }


    onUploadCSV = (event) => {
        const fileName = event.target.files[0].name.split(".csv")[0]
        const fileType = event.target.files[0].type
        const fileSize = event.target.files[0].size

        console.log(fileName)
        console.log(fileType)
        console.log(fileSize)
        console.log(event.target.files[0])

        this.props.setCSVFile(event.target.files[0])
        this.props.setDatasetName(fileName)

        // let reader = new FileReader();
        // reader.onload = function(e) {
        //     // Use reader.result
        //     // alert(reader.result)
        //
        // }
        // reader.readAsText(event.target.files[0]);

    }

    render(){
        const { datasetName } = this.props
        const csv_label = "Numerical file, column-wise features and no ground truths appended"

        return(
            <ParamBox>
                <Heading level={5} margin="none"> Select Dataset </Heading>
                <Select
                  options={['iris', 'compound', 'flame']}
                  value={datasetName}
                  placeholder={"Tap to select"}
                  onChange={({ option }) => this.onSelectDataset(option)}
                />
                <Heading level={5} margin="none" data-tip={csv_label} data-place={"right"}> ...or Upload CSV </Heading>
                <TextInput icon={<DocumentCsv/>} type={"file"} onChange={this.onUploadCSV}/>
            </ParamBox>

        );
    }

}

