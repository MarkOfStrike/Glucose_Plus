import React from 'react';
import { View, Text } from 'react-native';
import ItemDiary from './ItemDiary/ItemDiary';
import {style} from './RecordsStyle'



const Records = (props:any) => {



    if(!props.Records){
        return(
            <NonRecord/>
        )
    }
    else{
        return(
            <View style={style.container}>
                {props.Records.map((v: any, i: number) => {
                        return (
                            <ItemDiary key={i}/>
                        )
                    })}
            </View>
        )
    }
}



const NonRecord = () => {
    return(
        <View style={{ marginTop: '50%', alignSelf: 'center' }}>
            <Text style={{ color: 'red', fontSize: 16 }}>Данные отсутствуют</Text>
        </View>
    )
}

export default Records;