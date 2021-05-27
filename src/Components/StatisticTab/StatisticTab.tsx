import React from 'react'
import { Text, View } from 'react-native'
import {Line} from 'react-native-svg'
// import {LineChart} from 'react-native-charts-wrapper'


const StatisticTab = () => {

    const data = {
        labels:['asd','qwe','zxc'],
        datasets:[{
            data:[3,5,6]

        }]
     }

    return(
        <View>
        <View >
            <Line />
            {/* <LineChart data={{dataSets:[{label:'ASD', values:[{x:5,y:90},{x:10,y:130},{x:50,y:2000, marker:'eat more'}]}]}}/> */}
        </View>
        </View>
    )
}

export default StatisticTab;