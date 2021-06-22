import React from 'react'
import { View, Text } from 'react-native-animatable';
import {style} from './OtherStatsStyle'


const OtherStats = (props: any) => {

    return (
        <View style={style.container}>
            <Text style={style.text}>Средние показатели:</Text>
            <Text style={style.text_info}>Инс: {ConvertString(props.InsLevel)}</Text>
            <Text style={style.text_info}>ХЕ: {ConvertString(props.Xe)}</Text>
            <Text style={style.text_info}>Угл: {ConvertString(props.Carbohydrates)}</Text>
            <Text style={style.text_info}>УК: {ConvertString(props.CarbohydrateRatio)}</Text>
        </View>
    )
}

const ConvertString = (value: number): string => value > 0 ? value.toFixed(2) : '---';

export default OtherStats;