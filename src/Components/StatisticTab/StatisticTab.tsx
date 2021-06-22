import React from 'react';
import {
    Button, ScrollView, Text, TouchableOpacity, View
} from 'react-native';
import {
    LineChart
} from 'react-native-chart-kit';
import { Dataset } from 'react-native-chart-kit/dist/HelperTypes';
import { LineChartData } from 'react-native-chart-kit/dist/line-chart/LineChart';
import { connect } from 'react-redux';

import { GetDataTest, SetDate, SetFormat } from '../../Store/Reducers/StatisticTab/Action';
import { FormatDate } from '../../Store/Reducers/StatisticTab/Reducer';
import { IApplicationState } from '../../Store/StoreInterfaces';


const StatisticTab = (props: any) => {

    const [chartData, setChartData] = React.useState<LineChartData>({ labels: [''], datasets: [{ data: [0] }] })

    React.useEffect(() => {
        
        const DATA: Dataset = {
            data: [0],
            color: (c = 0) => `rgba(0,0,0,${0})`, strokeWidth: 0, withDots: false
        }
        const dataSets: Array<Dataset> = [];

        if (props.data.glucose.length > 0 && !props.data.glucose.every((v: number, i: number) => v === 0)) {
            dataSets.push({
                data: [...props.data.glucose],
                color: (opacity = 1) => `#470736`
            })
        }
        else {
            dataSets.push(DATA)
        }

        if (props.data.inc.length > 0 && !props.data.inc.every((v: number, i: number) => v === 0)) {
            dataSets.push({
                data: [...props.data.inc],
                color: (opacity = 1) => `#ffd800`
            })
        } else {
            dataSets.push(DATA)
        }

        if (props.data.xe.length > 0 && !props.data.xe.every((v: number, i: number) => v === 0)) {
            dataSets.push({
                data: [...props.data.xe],
                color: (opacity = 1) => `#71bc78`
            })
        } else {
            dataSets.push(DATA)
        }

        if (props.data.ygl.length > 0 && !props.data.ygl.every((v: number, i: number) => v === 0)) {
            dataSets.push({
                data: [...props.data.ygl],
                color: (opacity = 1) => `#2f6334`
            })
        } else {
            dataSets.push(DATA)
        }

        if (props.data.yk.length > 0 && !props.data.yk.every((v: number, i: number) => v === 0)) {
            dataSets.push({
                data: [...props.data.yk],
                color: (opacity = 1) => `#f24666`
            })
        } else {
            dataSets.push(DATA)
        }

        const newData: LineChartData = {
            labels: props.label,
            datasets: [
                ...dataSets
            ],
            legend: ['Г', 'Инс.', 'Хе', 'Угл.', 'Угл.К.']


        }

        setChartData(newData);




    }, [props.data, props.label])


    const EditFormatDate = (format: FormatDate) => {

        props.SetFormat(format);
        EditDate(0);
    }

    const EditDate = (val: number) => {

        props.SetDate(val)
        props.GetDataTest();
    }



    return (
        <View>

            <View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 15 }}>
                    <Button title={'Day'} onPress={() => {
                        EditFormatDate(FormatDate.day);
                    }} />
                    <Button title={'Week'} onPress={() => {
                        EditFormatDate(FormatDate.week);
                    }} />
                    <Button title={'Month'} onPress={() => {
                        EditFormatDate(FormatDate.month);
                    }} />
                    <Button title={'Year'} onPress={() => {
                        EditFormatDate(FormatDate.year);
                    }} />
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'center', padding: 15 }}>
                    <TouchableOpacity style={{ width: 50, height: 50, borderWidth: 1, alignItems: 'center', alignContent: 'center', justifyContent: 'center' }} onPress={(e) => {
                        EditDate(-1);
                    }}>
                        <Text>{'<'}</Text>
                    </TouchableOpacity>
                    <Text>{props.dateTime}</Text>
                    <TouchableOpacity style={{ width: 50, height: 50, borderWidth: 1, alignItems: 'center', alignContent: 'center', justifyContent: 'center' }} onPress={(e) => {

                        EditDate(1);
                    }}>
                        <Text>{'>'}</Text>
                    </TouchableOpacity>
                </View>
                <Text>Bezier Line Chart</Text>
                <View>
                    <ScrollView horizontal>
                        <LineChart
                            onDataPointClick={(dot) => {
                            }}
                            data={chartData}
                            width={1000}
                            height={400}

                            yAxisInterval={1}
                            verticalLabelRotation={90}//Поворот названий по оси x
                            chartConfig={{
                                backgroundColor: "#e26a00",
                                backgroundGradientFrom: "#fb8c00",
                                backgroundGradientTo: "#ffa726",
                                decimalPlaces: 2, // optional, defaults to 2dp
                                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                style: {
                                    borderRadius: 16,
                                },
                                propsForDots: {
                                    r: "6",
                                    strokeWidth: "2",
                                    stroke: "#ffa726"
                                }
                            }}
                            bezier

                            style={{
                                alignSelf: 'center',
                                marginVertical: 8,
                                borderRadius: 16
                            }}
                        />
                    </ScrollView>
                </View>
            </View>

        </View>
    )
}

const StatisticTabContainer = (props: any) => {

    React.useEffect(() => {
        props.GetDataTest()
    }, [props.GetDataTest])

    return (
        <StatisticTab {...props} />
    )
}

const mapStateToProps = (state: IApplicationState) => ({

    dateTime: state.StatisticTab.currentOutDate,
    data: state.StatisticTab.statistic,
    label: state.StatisticTab.labels


})

export default connect(
    mapStateToProps,
    {
        GetDataTest,
        SetDate,
        SetFormat
    }
)(StatisticTabContainer)