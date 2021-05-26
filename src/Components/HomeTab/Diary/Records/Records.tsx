import React from 'react';
import { View, Text } from 'react-native';
import { IDiaryRecord, IRecordFoodDiary, IRecordGlucoseDiray, TypeRecord } from '../../../../Interfaces/IDiary';
import { IDictionary } from '../../../../Interfaces/IDictionary';
import ItemDiary from './ItemDiary/ItemDiary';
import {style} from './RecordsStyle'



const Records = (props:any) => {

    const [recordKeys, setRecordsKeys] = React.useState<Array<string>>([]);

    // const recordKeys:Array<string> = [];

    React.useEffect(() => {

        const mas:Array<string> = []

        for(const k in props.Records as IDictionary<IDiaryRecord<IRecordFoodDiary|IRecordGlucoseDiray>>){
            mas.push(k);
        }

        setRecordsKeys(mas);

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

                    return (
                        <RecordBlock key={i} date={key} records={props.Records[key]}/>
                    )
                })}
            </View>
        )
    }
}

const RecordBlock = (props:any) => {
    return(
        <View>
            <Text>{props.date}</Text>
            <View>
                {props.records.map((v:any, i:number) => {

                    if(v.Type as TypeRecord === TypeRecord.Glucose){
                        return ( <ItemGlucose key={i} {...v}/> )
                    } else if(v.Type as TypeRecord.Product) {
                        return ( <ItemFood key={i} {...v}/> )
                    }


                })}
            </View>
        </View>
    )
}

const ItemFood = (props:IDiaryRecord<IRecordFoodDiary>) => {
    // console.log(props);
    
    return(
        <View>
            <Text>{props.ObjectRecord.Name}</Text>
            <View>
                <View style={{justifyContent:'space-between', alignContent:'space-between', borderWidth:1, flexDirection:'row'}}>
                    <Text style={{borderWidth:1, alignItems:'center', alignSelf:'flex-start'}}>{props.ObjectRecord.data.Calories}</Text>
                    <Text style={{borderWidth:1, alignItems:'center', alignSelf:'flex-start'}}>{props.ObjectRecord.data.Carbohydrates}</Text>
                    <Text style={{borderWidth:1, alignItems:'center', alignSelf:'flex-start'}}>{props.ObjectRecord.data.Fats}</Text>
                    <Text style={{borderWidth:1, alignItems:'center', alignSelf:'flex-start'}}>{props.ObjectRecord.data.Gi}</Text>
                    <Text style={{borderWidth:1, alignItems:'center', alignSelf:'flex-start'}}>{props.ObjectRecord.data.Proteins}</Text>
                    <Text style={{borderWidth:1, alignItems:'center', alignSelf:'flex-start'}}>{props.ObjectRecord.data.Xe}</Text>
                </View>
                <View>
                    <Text>{new Date(props.Date).toLocaleTimeString()}</Text>
                    <Text>{props.ObjectRecord.data.weight}</Text>
                </View>
            </View>
        </View>
    )
}

const ItemGlucose = (props:IDiaryRecord<IRecordGlucoseDiray>) => {
    // console.log(props);
    
    return (
        <View>
            <Text>Глюкоза</Text>
        </View>
    )
}

const NonRecord = () => {
    return(
        <View style={{ marginTop: '50%', alignSelf: 'center' }}>
            <Text style={{ color: 'red', fontSize: 16 }}>Данные отсутствуют</Text>
        </View>
    )
}

export default Records;