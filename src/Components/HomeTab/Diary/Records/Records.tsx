import React from 'react';
import { View, Text, Image } from 'react-native';
import { IDiaryRecord, IRecordFoodDiary, IRecordGlucoseDiray, TypeRecord } from '../../../../Interfaces/IDiary';
import { IDictionary } from '../../../../Interfaces/IDictionary';
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
        <View style={{marginBottom:10, marginLeft:2}}>
            <Text style={{fontSize:13, color:'grey'}}>{props.date}</Text>
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
    return(
        <View style={{ flexDirection: 'row', borderWidth: 1, justifyContent:'flex-start', padding:2, margin:2, marginLeft:0}}>
            <View style={{flex:1, alignItems:'center', justifyContent:'center',}}>
                <Image source={require('../../../../../assets/images/eat.png')} style={{width:40, height:40,}}/>
            </View>
            <View style={{flex:5}}>
                <View style={{flexDirection: 'row', justifyContent:'space-between'}}>
                    <View style={{flex:3, justifyContent:'center', marginLeft:5}}>
                        <Text style={{fontSize:20, flexWrap:'wrap', color:'green'}}>{props.ObjectRecord.Name}</Text>
                        <View style={{ justifyContent: 'space-between', alignContent: 'space-between', flexDirection: 'row', flexWrap:'wrap' }}>
                            <InfoText title={'Кал:'+props.ObjectRecord.data.Calories} />
                            <InfoText title={'У:'+props.ObjectRecord.data.Carbohydrates} />
                            <InfoText title={'Ж:'+props.ObjectRecord.data.Fats} />
                            <InfoText title={'ГИ'+props.ObjectRecord.data.Gi} />
                            <InfoText title={'Б:'+props.ObjectRecord.data.Proteins} />
                            <InfoText title={'ХЕ'+props.ObjectRecord.data.Xe} />
                        </View>
                    </View>
                    <View style={{flex:1, justifyContent:'center', alignItems:'flex-end', marginRight:5}}>
                        <Text>{props.ObjectRecord.data.weight} г.</Text>
                        <InfoText title={new Date(props.Date).toLocaleTimeString()}/>
                    </View>
                </View>
            </View>
        </View>
    )
}

const InfoText = (props:any) => {
    return (
        <Text style={{alignItems:'center', fontSize:9, color:'grey'}}>{props.title}</Text>
    )
}

const ItemGlucose = (props:IDiaryRecord<IRecordGlucoseDiray>) => {
    // console.log(props);
    
    return (
        <View style={{ flexDirection: 'row', borderWidth: 1, justifyContent:'flex-start', padding:2, margin:2, marginLeft:0}}>
            <View style={{flex:1, alignItems:'center', justifyContent:'center',}}>
                <Image source={require('../../../../../assets/images/blood.png')} style={{width:40, height:40,}}/>
            </View>
            <View style={{flex:5, flexDirection:'row',}}>
                <View style={{marginLeft:5}}>
                    <Text style={{fontSize:16, color:'red'}}>Сахар в крови</Text>
                </View>
                <View style={{flex:1, justifyContent:'flex-start', alignItems:'flex-end', marginRight:5}}>
                        <Text>{props.ObjectRecord.Level} mg/ml</Text>
                        <InfoText title={new Date(props.Date).toLocaleTimeString()}/>
                </View>
            </View>
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