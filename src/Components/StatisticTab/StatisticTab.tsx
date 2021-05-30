import React from 'react'
import { Dimensions, Text, View } from 'react-native'
import { LineChart } from 'react-native-chart-kit';
import { Chart, Line, Area, HorizontalAxis, VerticalAxis } from 'react-native-responsive-linechart';
// import {Line} from 'react-native-svg'
// import {LineChart} from 'react-native-charts-wrapper'


const StatisticTab = () => {

    // const data = {
    //     labels:['asd','qwe','zxc'],
    //     datasets:[{
    //         data:[3,5,6]

    //     }]
    //  }

    const data = {
        labels: ["January", "February", "March", "April", "May", "June"],
        datasets: [
          {
            data: [20, 45, 28, 80, 99, 43],
            color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
            strokeWidth: 2 // optional
          }
        ],
        legend: ["Rainy Days"] // optional
      };

    return(
        <View>

            <View>
                <Text>Bezier Line Chart</Text>
                <LineChart
                    onDataPointClick={(dot) => {
                    }}
                    data={{
                        labels: ["January", "February", "March", "April", "May", "June"],
                        datasets: [
                            {
                                data: [
                                    Math.random() * 100,
                                    Math.random() * 100,
                                    Math.random() * 100,
                                    Math.random() * 100,
                                    Math.random() * 100,
                                    Math.random() * 100,
                                    Math.random() * 100,
                                    Math.random() * 100,
                                    Math.random() * 100,
                                ]
                            }
                        ]
                    }}
                    width={Dimensions.get("window").width - 10} // from react-native
                    height={520}
                    yAxisLabel="$"
                    yAxisSuffix="kk"
                    yAxisInterval={1} // optional, defaults to 1
                    chartConfig={{
                        // scrollableDotRadius:6,
                        // scrollableInfoSize:{
                        //     height: 520,
                        //     width: Dimensions.get("window").width
                        // },
                        backgroundColor: "#e26a00",
                        backgroundGradientFrom: "#fb8c00",
                        backgroundGradientTo: "#ffa726",
                        decimalPlaces: 2, // optional, defaults to 2dp
                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        style: {
                            borderRadius: 16
                        },
                        propsForDots: {
                            r: "6",
                            strokeWidth: "2",
                            stroke: "#ffa726"
                        }
                    }}
                    bezier
                    // withScrollableDot
                    

                    style={{
                        alignSelf:'center',
                        marginVertical: 8,
                        borderRadius: 16
                    }}
                />
            </View>

        </View>
    )
}

export default StatisticTab;