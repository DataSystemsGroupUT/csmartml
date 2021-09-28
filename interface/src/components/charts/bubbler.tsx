import * as React from 'react';
import { ParallelCoordinates, XYPlot,MarkSeriesCanvas, MarkSeries, LabelSeries, Highlight, Hint,
    XAxis, YAxis, VerticalGridLines, HorizontalGridLines }
    from "react-vis";
import {REFORMATTED_CVI_OBJ} from "../../constants/TaskConfiguration";


export interface BubbleCustomProps {
    currentMetrics: any,
    threeMetricsData: any,
    metricRanges: any
}

export interface BubbleCustomState {
    metrics: any,
    metricRanges: any,
    data: any,
    value: any
}

const colorType = 'typeA'

const colorRanges = {
  typeA: ['#59E4EC', '#0D676C'],
  typeB: ['#EFC1E3', '#B52F93']
};

export default class BubbleCustom extends React.Component<BubbleCustomProps, BubbleCustomState>{
    constructor(props: BubbleCustomProps) {
        super(props);
        this.state = {
            metrics: props.currentMetrics,
            metricRanges: props.metricRanges,
            data: props.threeMetricsData,
            value: false
        }
    }

    componentDidUpdate(prevProps: Readonly<BubbleCustomProps>, prevState: Readonly<BubbleCustomState>, snapshot?: any) {
        if(prevProps.threeMetricsData != this.props.threeMetricsData){
            this.setState({data: this.props.threeMetricsData})
        }
    }

    render() {
        const { metricRanges, data, value, metrics } = this.state
        return (
            <div className="canvas-wrapper">
                <XYPlot
                  onMouseLeave={() => this.setState({value: false})}
                  width={500}
                  height={300}
                >
                  <VerticalGridLines />
                  <HorizontalGridLines />
                  <XAxis title={REFORMATTED_CVI_OBJ[metrics[2]][0] + " (" + REFORMATTED_CVI_OBJ[metrics[2]][2] + ")"}/>
                  <YAxis title={REFORMATTED_CVI_OBJ[metrics[1]][0] + " ("  + REFORMATTED_CVI_OBJ[metrics[1]][2] + ")"}  />
                  <MarkSeries
                      animation={true}
                      className={'mark-series-example'}
                      sizeRange={metricRanges[2]}
                      seriesId={'my-example-scatterplot'}
                      colorRange={colorRanges[colorType]}
                      opacityType={"literal"}
                      data={data}
                      onNearestXY={val => this.setState({value: val})}
                      onValueMouseOver={
                          (datapoint, event) =>{
                            // does something on click
                            // you can access the value of the event
                                    console.log(datapoint)
                          }
                      }

                    />
                    { this.state.value ?
                    <Hint value={value}>
                      <div style={{background: '#daa520', padding: "1em", borderRadius: "1em"}}>
                        <h3 style={{color: 'white'}}> Selected Configuration </h3>
                        <p style={{color: 'white', margin:0}}>{REFORMATTED_CVI_OBJ[metrics[2]][0] + ": " + value.x}</p>
                        <p style={{color: 'white', margin:0}}>{REFORMATTED_CVI_OBJ[metrics[1]][0] + ": " + value.y}</p>
                        <p style={{color: 'white', margin:0}}>(Scaled){REFORMATTED_CVI_OBJ[metrics[0]][0] + ": " + value.size}</p>
                        <p style={{color: 'white', margin:0}}>{value.label}</p>
                      </div>
                    </Hint>
                        : null
                    }
                  {/*{this.state.value ? <Hint value={this.state.value} align={{horizontal: 'bottom', vertical: 'bottom'}} /> : null}*/}
                </XYPlot>
                </div>
        );
    }


}
// export default function BubbleCustom(props){
//     // constructor(props) {
//     //     super(props);
//     //     this.state = {
//     //     filter: null,
//     //     hovered: null,
//     //     highlighting: false
//     //   };
//     // }
//     let state = {
//         filter: null,
//         hovered: null,
//         highlighting: false
//       };
//
//     const DATA = [
//   {
//     name: 'Mercedes',
//     mileage: 7,
//     price: 10,
//     safety: 8,
//     performance: 9,
//     interior: 7,
//     warranty: 7
//   },
//   {
//     name: 'Honda',
//     mileage: 8,
//     price: 6,
//     safety: 9,
//     performance: 6,
//     interior: 3,
//     warranty: 9,
//     style: {
//       strokeWidth: 3,
//       strokeDasharray: '2, 2'
//     }
//   },
//   {
//     name: 'Chevrolet',
//     mileage: 5,
//     price: 4,
//     safety: 6,
//     performance: 4,
//     interior: 5,
//     warranty: 6
//   }
// ];
//
// //     const basicFormat = format('.2r');
// // const wideFormat = format('.3r');
//
//     const colors=[
//                 '#19CDD7',
//                 '#DDB27C',
//                 '#88572C',
//                 '#FF991F',
//                 '#F15C17',
//                 '#223F9A',
//                 '#DA70BF',
//                 '#125C77'
//               ]
//
//     // render() {
//         // @ts-ignore
//         // let {filter, hovered, highlighting} = state;
//         //
//         // const highlightPoint = d => {
//         //   if (!filter) {
//         //     return false;
//         //   }
//         //   // @ts-ignore
//         //     const leftRight = d.x <= filter.right && d.x >= filter.left;
//         //   // @ts-ignore
//         //     const upDown = d.y <= filter.top && d.y >= filter.bottom;
//         //   return leftRight && upDown;
//         // };
//     var value = false
//     const colorType = 'typeA'
//
//     const colorRanges = {
//       typeA: ['#59E4EC', '#0D676C'],
//       typeB: ['#EFC1E3', '#B52F93']
//     };
//
//
//     const markSeriesProps = {
//       animation: true,
//       className: 'mark-series-example',
//       sizeRange: props.data[2][2],
//       seriesId: 'my-example-scatterplot',
//       colorRange: colorRanges[colorType],
//       opacityType: 'literal',
//       data: props.data[0],
//       onNearestXY: value => show(value),
//       onValueMouseOver: (datapoint, event) =>{
//             // does something on click
//             // you can access the value of the event
//                     console.log(datapoint)
//           }
//       }
//
//
//     function show(d){
//              value = d
//     }
//
//     return (
//         <div className="canvas-wrapper">
//             <XYPlot
//               onMouseLeave={() => show(false)}
//               width={500}
//               height={300}
//             >
//               <VerticalGridLines />
//               <HorizontalGridLines />
//               <XAxis title={REFORMATTED_CVI_OBJ[props.data[1][2]][0] + " (" + REFORMATTED_CVI_OBJ[props.data[1][2]][2] + ")"}/>
//               <YAxis title={REFORMATTED_CVI_OBJ[props.data[1][1]][0] + " ("  + REFORMATTED_CVI_OBJ[props.data[1][1]][2] + ")"}  />
//               <MarkSeries {...markSeriesProps} />
//               {/*{value ? <Hint value={value} /> : null}*/}
//             </XYPlot>
//             </div>
//     );
//
//         //  return(
//         // // <XYPlot width={500} height={300} xDomain={[-1, 1]} yDomain={[-1, 1]}>
//         //              // @ts-ignore
//         // <XYPlot width={500} height={300} xDomain={props.data[2][0]} yDomain={props.data[2][1]}>
//         //     <VerticalGridLines />
//         //     <HorizontalGridLines />
//         //
//         //     <DiscreteColorLegendItem
//         //       colors={[
//         //         '#19CDD7',
//         //         '#DDB27C',
//         //         '#88572C',
//         //         '#FF991F',
//         //         '#F15C17',
//         //         '#223F9A',
//         //         '#DA70BF',
//         //         '#125C77'
//         //       ]}
//         //       items={[
//         //         'NGEN-1',
//         //         'NGEN-2',
//         //         'NGEN-3',
//         //         'NGEN-4',
//         //         'NGEN-5',
//         //         'NGEN-6',
//         //         'NGEN-7'
//         //       ]}
//         //       orientation="vertical"
//         //     />
//         //
//         //   <XAxis title={REFORMATTED_CVI_OBJ[props.data[1][2]][0] + " (" + REFORMATTED_CVI_OBJ[props.data[1][2]][2] + ")"}/>
//         //   <YAxis title={REFORMATTED_CVI_OBJ[props.data[1][1]][0] + " ("  + REFORMATTED_CVI_OBJ[props.data[1][1]][2] + ")"}  />
//         //   {/*<Highlight*/}
//         //   {/*  drag*/}
//         //   {/*  onBrushStart={() => this.setState({highlighting: true})}*/}
//         //   {/*  onBrush={area => this.setState({filter: area})}*/}
//         //   {/*  onBrushEnd={area =>*/}
//         //   {/*    this.setState({highlighting: false, filter: area})*/}
//         //   {/*  }*/}
//         //   {/*  onDragStart={area => this.setState({highlighting: true})}*/}
//         //   {/*  onDrag={area => this.setState({filter: area})}*/}
//         //   {/*  onDragEnd={area =>*/}
//         //   {/*    this.setState({highlighting: false, filter: area})*/}
//         //   {/*  }*/}
//         //   {/*/>*/}
//         //
//         //    {props.data[0].map((value, index) => {
//         //     // return <li key={index}>{value}</li>
//         //     //   return <ScatterSeries data={value} name={`NGEN: ${index}`}/>
//         //     //    return <LabelSeries animation allowOffsetToBeReversed data={value}/>
//         //     //    {value.map((v, i) => {
//         //     //         console.log("Value: ", value)
//         //     //   return <MarkSeries  sizeRange={props.data[2][2]} data={v} strokeWidth={2}/>
//         //     //    })}
//         //        return <MarkSeries  sizeRange={props.data[2][2]} data={value} strokeWidth={2} fill={colors[index]}/>
//         //
//         //   })}
//         //
//         //   {/*<MarkSeries*/}
//         //   {/*  className="mark-series-example"*/}
//         //   {/*  strokeWidth={2}*/}
//         //   {/*  opacity="0.8"*/}
//         //   {/*  sizeRange={props.data[2][2]}*/}
//         //   {/*  style={{pointerEvents: highlighting ? 'none' : ''}}*/}
//         //   {/*  colorType="literal"*/}
//         //   {/*  getColor={d => (highlightPoint(d) ? '#EF5D28' : '#12939A')}*/}
//         //   {/*  onValueMouseOver={d => show(d)}*/}
//         //   {/*  onValueMouseOut={d => show(false)}*/}
//         //   {/*  data={props.data[0]}*/}
//         //   {/*/>*/}
//         //   {/*{hovered && <Hint value={hovered} />}*/}
//         // </XYPlot>
//         //   )
//     // }
//   //   return (
//   //   <ParallelCoordinates
//   //     data={props.data[0]}
//   //     tickFormat={t => t}
//   //     margin={0}
//   //     colorRange={['#172d47', '#911116', '#998965']}
//   //     domains={[
//   //         {name: 'i_index', domain: props.data[2][2], getValue: d => d.i_index},
//   //         {name: 'modified_hubert_t', domain: props.data[2][1], getValue: d => d.modified_hubert_t},
//   //         {name: 'banfeld_raferty', domain: props.data[2][0], getValue: d => d.banfeld_raferty},
//   //     ]}
//   //     // domains={[
//   //     //   {name: 'mileage', domain: [0, 10]},
//   //     //   {
//   //     //     name: 'price',
//   //     //     domain: [2, 16],
//   //     //     tickFormat: t => t,
//   //     //     getValue: d => d.price
//   //     //   },
//   //     //   {name: 'safety', domain: [5, 10], getValue: d => d.safety},
//   //     //   {name: 'performance', domain: [0, 10], getValue: d => d.performance},
//   //     //   {name: 'interior', domain: [0, 7], getValue: d => d.interior},
//   //     //   {name: 'warranty', domain: [10, 2], getValue: d => d.warranty}
//   //     // ]}
//   //     // showMarks
//   //     width={500}
//   //     height={300}
//   //   />
//   // );
//
//
//
// }





          {/* {props.data[0].map((value, index) => {*/}
          {/*  // return <li key={index}>{value}</li>*/}
          {/*  //   return <ScatterSeries data={value} name={`NGEN: ${index}`}/>*/}
          {/*  //    return <LabelSeries animation allowOffsetToBeReversed data={value}/>*/}
          {/*     {value.map((v, i) => {*/}
          {/*          console.log("Value: ", value)*/}
          {/*    return <MarkSeries  sizeRange={props.data[2][2]} data={v} strokeWidth={2}/>*/}
          {/*     })}*/}

          {/*})}*/}

