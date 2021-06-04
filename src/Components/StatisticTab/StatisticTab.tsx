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
import moment from 'moment'

enum FormatDate {
    day,week,month,year
}

const StatisticTab = () => {

    const [currentFormatDate, setCurrentFormatDate] = React.useState(FormatDate.day);

    const [currentDate, setCurrentDate] = React.useState(new Date());
    const [outDate, setOutDate] = React.useState<string>('');

    const [countDays, setCountDays] = React.useState(0);

    const incrementDate = () => editDate(1);

    const decrementDate = () => editDate(-1);

    const editDate = (val:number) => {

        const mom = moment(currentDate);

        switch (currentFormatDate) {
            case FormatDate.day:
                setCurrentDate(mom.day(mom.get('day') + val).toDate())
                break;
            case FormatDate.week:
                setCurrentDate(mom.day(mom.get('day') + (7*val)).toDate())
                break;
            case FormatDate.month:
                setCurrentDate(mom.month(mom.get('month') + val).toDate())
                break;
            case FormatDate.year:
                setCurrentDate(mom.year(mom.get('year') + val).toDate())
                break;


            default:
                break;
        }

    }

    const setDateFromOut = (current:Date, format:FormatDate) => {

        switch (format) {
            case FormatDate.day:
                return moment(current).format('DD MMMM YYYY')

            case FormatDate.week:
                const start = moment(current).locale('ru').startOf('isoWeek');
                const end = moment(current).locale('ru').startOf('isoWeek').days(7);
                return `${start.format('DD MMMM YYYY')} - ${end.format('DD MMMM YYYY')}`

            case FormatDate.month:
                return moment(current).format('MMMM YYYY')

            case FormatDate.year:
                return `${moment(current).format('YYYY')}г.`

            default:
                return ''
        }
    }

    React.useEffect(() => {

        setOutDate(setDateFromOut(currentDate, currentFormatDate));
        
    },[currentDate])

    React.useEffect(() => {

        setCurrentDate(new Date());

    }, [currentFormatDate])


    // React.useEffect(() => {
    //     editDate(countDays)
    // },[countDays])

    const data = {
        
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
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                ], color: (c = 1) => `rgba(${Math.round(Math.random() * 100)},${Math.round(Math.random() * 100)},${Math.round(Math.random() * 100)},${c})`
            },
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
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                ], color: (c = 1) => `rgba(${Math.round(Math.random() * 100)},${Math.round(Math.random() * 100)},${Math.round(Math.random() * 100)},${c})`
            },
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
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                ], color: (c = 1) => `rgba(${Math.round(Math.random() * 100)},${Math.round(Math.random() * 100)},${Math.round(Math.random() * 100)},${c})`
            }
        ]
    }

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
                        setCurrentFormatDate(FormatDate.day);
                    }}/>
                    <Button title={'Week'} onPress={()=>{
                        setCurrentFormatDate(FormatDate.week);
                    }}/>
                    <Button title={'Month'} onPress={()=>{
                        setCurrentFormatDate(FormatDate.month);
                    }}/>
                    <Button title={'Year'} onPress={()=>{
                        setCurrentFormatDate(FormatDate.year);
                    }}/>
                </View>
                <View style={{flexDirection:'row', justifyContent:'center', padding: 15}}>
                    <TouchableOpacity style={{width:50, height:50, borderWidth:1,  alignItems:'center', alignContent:'center', justifyContent:'center'}} onPress={(e) => {
                        // setCountDays(countDays - 1);
                        decrementDate();
                    }}>
                        <Text>{'<'}</Text>
                    </TouchableOpacity>
                    {/* <Text>{moment(currentDate).locale('ru').format('DD.MM.YYYY')}</Text> */}
                    <Text>{outDate}</Text>
                    <TouchableOpacity style={{width:50, height:50, borderWidth:1, alignItems:'center', alignContent:'center', justifyContent:'center'}} onPress={(e) => {
                        // setCountDays(countDays + 1);
                        incrementDate();
                    }}>
                        <Text>{'>'}</Text>
                    </TouchableOpacity>
                </View>
                <Text>Bezier Line Chart</Text>
                <ScrollView horizontal>
                <LineChart
                    onDataPointClick={(dot) => {
                    }}
                    data={data}
                    // width={Dimensions.get("window").width - 10} // from react-native
                    width={1000} // from react-native
                    height={520}
                    yAxisLabel="$"
                    yAxisSuffix="kk"
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



})

export default connect(
    mapStateToProps,
    {

    }
)(StatisticTabContainer)

// export default StatisticTab;