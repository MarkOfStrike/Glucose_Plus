import React from 'react';
import { View, Text } from 'react-native';
import ItemDiary from './ItemDiary/ItemDiary';
import {style} from './RecordsStyle'



const Records = (props:any) => {

    console.log('RECORDS_VIEW');
    

    const recordKeys:Array<string> = [];

    React.useEffect(() => {

        for(let k in props.Records){
            recordKeys.push(k);
        }

    }, [props.Records])

    if(!props.Records){
        return(
            <NonRecord/>
        )
    }
    else{
        return(
            <View style={style.container}>
                {recordKeys.map((key, i) => {

                    console.log(props.Records[key])

                    return (
                        <ItemDiary key={i}/>
                    )
                })}
                {/* {props.Records.map((v: any, i: number) => {
                        return (
                            <ItemDiary key={i}/>
                        )
                    })} */}
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