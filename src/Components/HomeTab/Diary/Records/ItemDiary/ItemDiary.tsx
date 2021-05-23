import React, { FC } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { style } from './ItemDiaryStyle'


const ItemDiary:FC<any> = (props) => {
    return (
        <TouchableOpacity activeOpacity={.99} style={style.container}>
            {/* <BoxShadow>
            
            </BoxShadow> */}
            <View style={style.nameAndTimeContainer}>
                <Text style={style.headerText}>Привет</Text>
                <Text style={style.headerText}>Время и дата</Text>
            </View>
            <View style={style.infoContainer}>
                <Text style={style.info}>ГИ: {Math.floor(Math.random()*100)}</Text>
                <Text style={style.info}>ХЕ: {Math.floor(Math.random()*100)}</Text>
                <Text style={style.info}>Калл: {Math.floor(Math.random()*100)}</Text>
                <Text style={style.info}>Б: {Math.floor(Math.random()*100)}</Text>
                <Text style={style.info}>Ж: {Math.floor(Math.random()*100)}</Text>
                <Text style={style.info}>У: {Math.floor(Math.random()*100)}</Text>
            </View>
        </TouchableOpacity>
    )
}

export default ItemDiary;