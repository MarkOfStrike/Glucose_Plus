import React from 'react'
import { Button, Dimensions, ScrollView, StatusBar, StyleProp, Text, TextStyle, TouchableOpacity, View } from 'react-native'
import { LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph } from 'react-native-chart-kit';
import ScrollableTabView from 'react-native-scrollable-tab-view'
import { connect } from 'react-redux';
import { IApplicationState } from '../../Store/StoreInterfaces';
import {GetData, SetDate, SetFormat} from '../../Store/Reducers/StatisticTab/Action';
import moment from 'moment'
import { FormatDate } from '../../Store/Reducers/StatisticTab/Reducer';
import { LineChartData } from 'react-native-chart-kit/dist/line-chart/LineChart';
import { Dataset } from 'react-native-chart-kit/dist/HelperTypes';

// enum FormatDate {
//     day,week,month,year
// }


const StatisticTab = (props:any) => {

    console.log(props);
    

    const [currentFormatDate, setCurrentFormatDate] = React.useState(FormatDate.day);

    const [currentDate, setCurrentDate] = React.useState(new Date());
    const [outDate, setOutDate] = React.useState<string>('');

    const [countDays, setCountDays] = React.useState(0);

    const [chartData, setChartData] = React.useState<LineChartData>({labels:[''], datasets:[{data:[0]}]})
    const [el, setEl] = React.useState<JSX.Element>(<View></View>)

    React.useEffect(() => {
        props.GetData()
    }, [props.GetData])

    React.useEffect(() => {


        const dataSets: Array<Dataset> = [];

        if (props.data.glucose.length > 0) {
            dataSets.push({
                data: [...props.data.glucose]
            })
        }

        if (props.data.inc.length > 0) {
            dataSets.push({
                data: [...props.data.inc]
            })
        }

        if (props.data.xe.length > 0) {
            dataSets.push({
                data: [...props.data.xe]
            })
        }

        if (props.data.ygl.length > 0) {
            dataSets.push({
                data: [...props.data.ygl]
            })
        }

        if (props.data.yk.length > 0) {
            dataSets.push({
                data: [...props.data.yk]
            })
        }

        const newData:LineChartData = {
            labels: props.label,
            datasets: [
                ...dataSets,
                {
                    data:[0],
                    color: (c = 0) => `rgba(0,0,0,${0})`
                }
                // {
                //     data: [1],
                //     // data: [...(props.data.glucose as Array<number>)],  
                //     color: (c = 1) => `rgba(${Math.round(Math.random() * 100)},${Math.round(Math.random() * 100)},${Math.round(Math.random() * 100)},${c})`
                // },
                // {
                //     data: [2], 
                //     // data: [...(props.data.inc as Array<number>)], 
                //     color: (c = 1) => `rgba(${Math.round(Math.random() * 100)},${Math.round(Math.random() * 100)},${Math.round(Math.random() * 100)},${c})`
                // },
                // {
                //     data: [3], 
                //     // data: [...(props.data.xe as Array<number>)], 
                //     color: (c = 1) => `rgba(${Math.round(Math.random() * 100)},${Math.round(Math.random() * 100)},${Math.round(Math.random() * 100)},${c})`
                // },
                // {
                //     data: [4], 
                //     // data: [...(props.data.ygl as Array<number>)], 
                //     color: (c = 1) => `rgba(${Math.round(Math.random() * 100)},${Math.round(Math.random() * 100)},${Math.round(Math.random() * 100)},${c})`
                // },
                // {
                //     data: [5], 
                //     // data: [...(props.data.yk as Array<number>)], 
                //     color: (c = 1) => `rgba(${Math.round(Math.random() * 100)},${Math.round(Math.random() * 100)},${Math.round(Math.random() * 100)},${c})`
                // },
            ]
        }

        // setEl(<LineChart
        //     onDataPointClick={(dot) => {
        //     }}
        //     data={newData}
        //     width={Dimensions.get("window").width - 10} // from react-native
        //     // width={1000} // from react-native
        //     height={520}
        //     // yAxisLabel="$"
        //     // yAxisSuffix="kk"
        //     yAxisInterval={1} // optional, defaults to 1
        //     verticalLabelRotation={30}//Поворот названий по оси x
        //     chartConfig={{
        //         // scrollableDotRadius:6,
        //         // scrollableInfoSize:{
        //         //     height: 520,
        //         //     width: Dimensions.get("window").width
        //         // },
        //         // width: 2000,
        //         backgroundColor: "#e26a00",
        //         backgroundGradientFrom: "#fb8c00",
        //         backgroundGradientTo: "#ffa726",
        //         decimalPlaces: 2, // optional, defaults to 2dp
        //         color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        //         labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        //         style: {
        //             borderRadius: 16,
        //             // width:2000
        //         },
        //         propsForDots: {
        //             r: "6",
        //             strokeWidth: "2",
        //             stroke: "#ffa726"
        //         }
        //     }}
        //     bezier
        //     // withScrollableDot
            

        //     style={{
        //         // width:2000,
        //         alignSelf:'center',
        //         marginVertical: 8,
        //         borderRadius: 16
        //     }}
        // />)

        setChartData(newData);

    },[props.data])

    const EditDate = (val:number) => {
        props.SetDate(val)
        props.GetData();
    }

    // React.useEffect(() => {

    //     setOutDate(setDateFromOut(currentDate, currentFormatDate));
        
    // },[currentDate])

    // React.useEffect(() => {

    //     setCurrentDate(new Date());

    // }, [currentFormatDate])


    // React.useEffect(() => {
    //     editDate(countDays)
    // },[countDays])

    // const newData:LineChartData = {
    //     labels: props.label,
    //     datasets: [
    //         {
    //             data: [
    //                 ...props.data.glucose
    //             ], color: (c = 1) => `rgba(${Math.round(Math.random() * 100)},${Math.round(Math.random() * 100)},${Math.round(Math.random() * 100)},${c})`
    //         },
    //         {
    //             data: [
    //                 ...props.data.inc
    //             ], color: (c = 1) => `rgba(${Math.round(Math.random() * 100)},${Math.round(Math.random() * 100)},${Math.round(Math.random() * 100)},${c})`
    //         },
    //         {
    //             data: [
    //                 ...props.data.xe
    //             ], color: (c = 1) => `rgba(${Math.round(Math.random() * 100)},${Math.round(Math.random() * 100)},${Math.round(Math.random() * 100)},${c})`
    //         },
    //         {
    //             data: [
    //                 ...props.data.ygl
    //             ], color: (c = 1) => `rgba(${Math.round(Math.random() * 100)},${Math.round(Math.random() * 100)},${Math.round(Math.random() * 100)},${c})`
    //         },
    //         {
    //             data: [
    //                 ...props.data.yk
    //             ], color: (c = 1) => `rgba(${Math.round(Math.random() * 100)},${Math.round(Math.random() * 100)},${Math.round(Math.random() * 100)},${c})`
    //         },
    //     ]
    // }

    // const data = {
        
    //     labels: props.label,
    //     datasets: [
    //         {
    //             data: [
    //                 Math.random() * 100,
    //                 Math.random() * 100,
    //                 Math.random() * 100,
    //                 Math.random() * 100,
    //                 Math.random() * 100,
    //                 Math.random() * 100,
    //                 Math.random() * 100,
    //                 Math.random() * 100,
    //                 Math.random() * 100,
    //                 Math.random() * 100,
    //                 Math.random() * 100,
    //                 Math.random() * 100,
    //                 Math.random() * 100,
    //                 Math.random() * 100,
    //                 Math.random() * 100,
    //                 Math.random() * 100,
    //                 Math.random() * 100,
    //                 Math.random() * 100,
    //             ], color: (c = 1) => `rgba(${Math.round(Math.random() * 100)},${Math.round(Math.random() * 100)},${Math.round(Math.random() * 100)},${c})`
    //         },
    //         {
    //             data: [
    //                 Math.random() * 100,
    //                 Math.random() * 100,
    //                 Math.random() * 100,
    //                 Math.random() * 100,
    //                 Math.random() * 100,
    //                 Math.random() * 100,
    //                 Math.random() * 100,
    //                 Math.random() * 100,
    //                 Math.random() * 100,
    //                 Math.random() * 100,
    //                 Math.random() * 100,
    //                 Math.random() * 100,
    //                 Math.random() * 100,
    //                 Math.random() * 100,
    //                 Math.random() * 100,
    //                 Math.random() * 100,
    //                 Math.random() * 100,
    //                 Math.random() * 100,
    //             ], color: (c = 1) => `rgba(${Math.round(Math.random() * 100)},${Math.round(Math.random() * 100)},${Math.round(Math.random() * 100)},${c})`
    //         },
    //         {
    //             data: [
    //                 Math.random() * 100,
    //                 Math.random() * 100,
    //                 Math.random() * 100,
    //                 Math.random() * 100,
    //                 Math.random() * 100,
    //                 Math.random() * 100,
    //                 Math.random() * 100,
    //                 Math.random() * 100,
    //                 Math.random() * 100,
    //                 Math.random() * 100,
    //                 Math.random() * 100,
    //                 Math.random() * 100,
    //                 Math.random() * 100,
    //                 Math.random() * 100,
    //                 Math.random() * 100,
    //                 Math.random() * 100,
    //                 Math.random() * 100,
    //                 Math.random() * 100,
    //             ], color: (c = 1) => `rgba(${Math.round(Math.random() * 100)},${Math.round(Math.random() * 100)},${Math.round(Math.random() * 100)},${c})`
    //         }
    //     ]
    // }

    // const data = {
    //     labels: ["January", "February", "March", "April", "May", "June"],
    //     datasets: [
    //       {
    //         data: [20, 45, 28, 80, 99, 43],
    //         color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
    //         strokeWidth: 2 // optional
    //       },
    //       {
    //         data: [20, 53, 15, 95, 35, 85],
    //         color: (opacity = 1) => `rgba(34, 146, 21, ${opacity})`, // optional
    //         strokeWidth: 2 // optional
    //       },
    //       {
    //         data: [34, 23, 13, 76, 95, 46],
    //         color: (opacity = 1) => `rgba(246, 42, 153, ${opacity})`, // optional
    //         strokeWidth: 2 // optional
    //       },
    //       {
    //         data: [65, 89, 23, 14, 37, 85],
    //         color: (opacity = 1) => `rgba(3, 64, 184, ${opacity})`, // optional
    //         strokeWidth: 2 // optional
    //       }
    //     ],
    //     legend: ["Rainy Days", "Rainy Days", "Rainy Days", "Rainy Days"] // optional
    //   };

    return(
        <View>

            <View>
                <View style={{flexDirection:'row', justifyContent:'space-between', padding: 15}}>
                <Button title={'Day'} onPress={()=>{
                        props.SetFormat(FormatDate.day);
                    }}/>
                    <Button title={'Week'} onPress={()=>{
                        props.SetFormat(FormatDate.week);
                    }}/>
                    <Button title={'Month'} onPress={()=>{
                        props.SetFormat(FormatDate.month);
                    }}/>
                    <Button title={'Year'} onPress={()=>{
                        props.SetFormat(FormatDate.year);
                    }}/>
                </View>
                <View style={{flexDirection:'row', justifyContent:'center', padding: 15}}>
                    <TouchableOpacity style={{width:50, height:50, borderWidth:1,  alignItems:'center', alignContent:'center', justifyContent:'center'}} onPress={(e) => {
                        // setCountDays(countDays - 1);
                        EditDate(-1);
                    }}>
                        <Text>{'<'}</Text>
                    </TouchableOpacity>
                    {/* <Text>{moment(currentDate).locale('ru').format('DD.MM.YYYY')}</Text> */}
                    <Text>{props.dateTime}</Text>
                    <TouchableOpacity style={{width:50, height:50, borderWidth:1, alignItems:'center', alignContent:'center', justifyContent:'center'}} onPress={(e) => {
                        // setCountDays(countDays + 1);
                        EditDate(1);
                    }}>
                        <Text>{'>'}</Text>
                    </TouchableOpacity>
                </View>
                <Text>Bezier Line Chart</Text>
                <ScrollView horizontal>
                    {/* {el} */}
                <LineChart
                    onDataPointClick={(dot) => {
                    }}
                    data={chartData}
                    width={Dimensions.get("window").width - 10} // from react-native
                    // width={1000} // from react-native
                    height={520}
                    // yAxisLabel="$"
                    // yAxisSuffix="kk"
                    yAxisInterval={1} // optional, defaults to 1
                    verticalLabelRotation={30}//Поворот названий по оси x
                    chartConfig={{
                        // scrollableDotRadius:6,
                        // scrollableInfoSize:{
                        //     height: 520,
                        //     width: Dimensions.get("window").width
                        // },
                        // width: 2000,
                        backgroundColor: "#e26a00",
                        backgroundGradientFrom: "#fb8c00",
                        backgroundGradientTo: "#ffa726",
                        decimalPlaces: 2, // optional, defaults to 2dp
                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        style: {
                            borderRadius: 16,
                            // width:2000
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
                        // width:2000,
                        alignSelf:'center',
                        marginVertical: 8,
                        borderRadius: 16
                    }}
                />
                </ScrollView>
            </View>

        </View>
    )
}

const StatisticTabContainer = (props:any) => {
    return(
        <StatisticTab {...props}/>
    )
}

const mapStateToProps = (state:IApplicationState) => ({

    dateTime: state.StatisticTab.currentOutDate,
    data: state.StatisticTab.statistic,
    label: state.StatisticTab.labels


})

export default connect(
    mapStateToProps,
    {
        GetData,
        SetDate,
        SetFormat
    }
)(StatisticTabContainer)

// export default StatisticTab;