import React from 'react';
import { Text, View } from 'react-native';

import { style } from './ElementDiaryStyle';

// import {} from 'react-native-shadow'

const ElementDiary = () => {
    return (
        
        <View style={style.conrainer}>
            {/* <BoxShadow>
            
            </BoxShadow> */}
            <View style={style.nameAndTimeContainer}>
                <Text style={style.headerText}>Привет</Text>
                <Text style={style.headerText}>Время и дата</Text>
            </View>
            <View style={style.infoContainer}>
                <Text style={{ width: '33%' }}>ГИ: 1</Text>
                <Text style={{ width: '33%' }}>ХЕ: 2</Text>
                <Text style={{ width: '33%' }}>УГК: 3</Text>
            </View>
        </View>
    )
}

export default ElementDiary;