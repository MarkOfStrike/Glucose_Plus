import moment from 'moment';
import 'moment/locale/ru'
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

import {
    IDiaryRecord, IDiaryRecordNav, IRecordFoodDiary, IRecordGlucoseDiary, TypeRecord
} from '../../../../Interfaces/IDiary';
import { IDictionary } from '../../../../Interfaces/IDictionary';
import { GetValueStorage } from '../../../../StorageWork';
// import LinearGradient from 'react-native-linear-gradient';
// import 'react-native-linear-gradient/BVLinearGradient';
import { style } from './RecordsStyle';

const Records = (props:any) => {

    

    const [recordKeys, setRecordsKeys] = React.useState<Array<string>>([]);

    // const recordKeys:Array<string> = [];

    React.useEffect(() => {

        const mas:Array<string> = []

        for(const k in props.Records as IDictionary<IDiaryRecord<IRecordFoodDiary|IRecordGlucoseDiary>>){
            mas.push(k);
        }

        setRecordsKeys(mas);

    }, [props.Records])

    const Nav = (id:number, type:TypeRecord) => {
        props.Navigate('MoreDetailsOfRecord',{id, type});
    }


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
                        <RecordBlock key={i} date={key} records={props.Records[key]} Nav={Nav}/>
                    )
                })}
            </View>
        )
    }
}

const RecordBlock = (props:any) => {
    return(
        <View style={{marginBottom:10, marginLeft:2}}>
            <Text style={{fontSize:13, color:'grey'}}>{moment(new Date(props.date)).locale('ru').format('DD MMMM YYYYг.')}</Text>
            <View>
                {props.records && props.records.map((v:any, i:number) => {

                    if(v.Type as TypeRecord === TypeRecord.Glucose){
                        return ( <ItemGlucose key={i} {...v} nav={props.Nav} /> )
                    } else if(v.Type as TypeRecord.Product) {
                        return ( <ItemFood key={i} {...v} nav={props.Nav}/> )
                    }


                })}
            </View>
        </View>
    )
}

const ItemFood = (props:IDiaryRecordNav<IRecordFoodDiary>) => {

    return(
            <TouchableOpacity activeOpacity={0.7} onPress={() => {
                props.nav(props.ObjectRecord.Id, props.Type);
            }}>
                <View style={{ flexDirection: 'row', borderColor:'#73c86a', borderWidth: 1, borderTopWidth: 0, borderBottomRightRadius: 20, borderBottomLeftRadius: 20, justifyContent: 'flex-start', padding: 2, margin: 2, marginLeft: 0,  }}>
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>
                        <Image source={require('../../../../../assets/images/eat.png')} style={{ width: 40, height: 40, }} />
                    </View>
                    <View style={{ flex: 5 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{ flex: 3, justifyContent: 'center', marginLeft: 5 }}>
                                <Text style={{ fontSize: 20, flexWrap: 'wrap', color: 'green' }}>{props.ObjectRecord.Name}</Text>
                                <View style={{ justifyContent: 'space-between', alignContent: 'space-between', flexDirection: 'row', flexWrap: 'wrap' }}>
                                    <InfoText title={'Инс:' + props.ObjectRecord.data.InsLevel} />
                                    <InfoText title={'Хе:' + props.ObjectRecord.data.Xe} />
                                    <InfoText title={'Угл:' + props.ObjectRecord.data.Carbohydrates} />
                                    <InfoText title={'УК:' + props.ObjectRecord.data.CarbohydrateRatio} />
                                </View>
                            </View>
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end', marginRight: 5 }}>
                                <Text>{props.ObjectRecord.data.weight} г.</Text>
                                <InfoText title={new Date(props.Date).toLocaleTimeString()} />
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
    )
}

const InfoText = (props:any) => {
    return (
        <Text style={{alignItems:'center', fontSize:9, color:'grey'}}>{props.title}</Text>
    )
}

const ItemGlucose = (props:IDiaryRecordNav<IRecordGlucoseDiary>) => {

    const [measuring, setMeasuring] = React.useState<string>('');

    React.useEffect(() => {

        GetValueStorage('value_measuring').then(v => {
            setMeasuring(v);
            
        });

    },[])

    return (
        <TouchableOpacity activeOpacity={0.7} onPress={() => {
            props.nav(props.ObjectRecord.Id, props.Type);
        }}>
        <View style={{ flexDirection: 'row', borderWidth: 1,borderTopWidth:0, borderColor: '#d0a4a6', borderBottomRightRadius:20, borderBottomLeftRadius:20, justifyContent:'flex-start', padding:2, margin:2, marginLeft:0,}}>
            <View style={{flex:1, alignItems:'center', justifyContent:'center',}}>
                <Image source={require('../../../../../assets/images/blood.png')} style={{width:40, height:40,}}/>
            </View>
            <View style={{flex:5, flexDirection:'row',}}>
                <View style={{marginLeft:5}}>
                    <Text style={{fontSize:20, color:'red'}}>Сахар в крови</Text>
                </View>
                <View style={{flex:1, justifyContent:'flex-start', alignItems:'flex-end', marginRight:5}}>
                        <Text>{measuring == 'mmol/l' ? (props.ObjectRecord.Level / 18).toFixed(2) : props.ObjectRecord.Level} {measuring}</Text>
                        <InfoText title={new Date(props.Date).toLocaleTimeString()}/>
                </View>
            </View>
        </View>
        </TouchableOpacity>
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