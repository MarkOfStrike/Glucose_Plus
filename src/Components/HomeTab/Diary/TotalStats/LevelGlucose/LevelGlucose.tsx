import React from 'react'
import { View, Text } from 'react-native-animatable';
import { GetValueStorage } from '../../../../../StorageWork';
import {style} from './LevelGlucoseStyle'


const LevelGlucose = (props: any) => {

    const [measuring, setMeasuring] = React.useState<string>('');
    React.useEffect(() => {

        GetValueStorage('value_measuring').then(v => {
            setMeasuring(v);
            
        });

    },[])

    return (
        <View style={style.container}>
            <Text style={style.text}>Уровень глюкозы:</Text>
            <Text style={style.text_info}>Средний: {ConvertString(props.Avg, measuring)} {measuring}</Text>
            <Text style={style.text_info}>Мин: {ConvertString(props.Min, measuring)} {measuring}</Text>
            <Text style={style.text_info}>Макс: {ConvertString(props.Max, measuring)} {measuring}</Text>
        </View>
    )
}

const ConvertString = (value: number, format:string): string => {

    let tmp = value;

    if (format === 'mmol/l') {
        tmp /= 18;
    }

    return tmp > 0 ? tmp.toFixed(2) : '---';
}

export default LevelGlucose;
