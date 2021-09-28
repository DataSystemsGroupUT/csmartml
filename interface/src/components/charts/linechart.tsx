import Highcharts from 'highcharts';
import {
  HighchartsChart, Chart, withHighcharts, XAxis, YAxis, Title,
    Subtitle, Legend, LineSeries, Caption, ScatterSeries
} from 'react-jsx-highcharts';
import * as React from "react";
import { FORMATTED_CVI, REFORMATTED_CVI_OBJ } from "../../constants/TaskConfiguration";


export default function LineChartCustom(props) {
   return (
       <HighchartsChart >
      <Chart />

      {/*<Title> Population Evolution (I-Index) </Title>*/}

      {/*<Legend layout="vertical" align="right" verticalAlign="middle" />*/}

      <XAxis>
        <XAxis.Title>Number of Generations</XAxis.Title>
      </XAxis>

      <YAxis>
        <YAxis.Title> {REFORMATTED_CVI_OBJ[props.data[1]][0]} ({REFORMATTED_CVI_OBJ[props.data[1]][2]})</YAxis.Title>
          <ScatterSeries data={props.data[0]}/>
        {/*<LineSeries name="Installation" data={[43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175]} />*/}
      </YAxis>
    </HighchartsChart>
   )
}

export function LineChart2DCustom(props) {
   return (
       <HighchartsChart >
      <Chart />

      {/*<Title> Population Evolution (I-Index) </Title>*/}

      <Legend layout="vertical" align="right" verticalAlign="middle" />

      <XAxis>
        <XAxis.Title> {REFORMATTED_CVI_OBJ[props.data[1][0]][0]} ({REFORMATTED_CVI_OBJ[props.data[1][0]][2]}) </XAxis.Title>
      </XAxis>

      <YAxis>
        <YAxis.Title> {REFORMATTED_CVI_OBJ[props.data[1][1]][0]} ({REFORMATTED_CVI_OBJ[props.data[1][1]][2]})</YAxis.Title>
          {props.data[0].map((value, index) => {
            // return <li key={index}>{value}</li>
              return <ScatterSeries data={value} name={`NGEN: ${index}`}/>
          })}
          {/*<ScatterSeries data={props.data[0]}/>*/}
        {/*<LineSeries name="Installation" data={[43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175]} />*/}
      </YAxis>
    </HighchartsChart>
   )
}