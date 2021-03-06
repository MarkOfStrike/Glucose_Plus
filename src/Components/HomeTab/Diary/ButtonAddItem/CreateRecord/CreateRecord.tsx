import moment from 'moment';
import 'moment/locale/ru'
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { connect } from 'react-redux';

import { IDictionary } from '../../../../../Interfaces/IDictionary';
import {
    ClearRecord, SaveRecord, SetDate, SetFood, SetGlucose
} from '../../../../../Store/Reducers/CreateRecord/Action';
import { GetRecords, GetStatistic } from '../../../../../Store/Reducers/Diary/Action';
import { IApplicationState } from '../../../../../Store/StoreInterfaces';
import CustomButton from '../../../../CustomElement/CustomButton';
import Hr from '../../../../CustomElement/Hr';
import style from './CreateRecordStyle';
import FoodRecord from './FoodRecord/FoodRecord';
import GlucoseRecord from './GlucoseRecord/GlucoseRecord';

const CreateRecord = (props: any) => {

    const [dateView, setDateView] = React.useState<boolean>(false);
    const [keys, setKeys] = React.useState<Array<boolean>>([]);
    const [keysName, setKeysName] = React.useState<Array<string>>([])

    const [view, setView] = React.useState(<View></View>)
    const [nameView, setNameView] = React.useState<string>('Глюкоза')

    const el: IDictionary<JSX.Element> = {
        "Глюкоза": <GlucoseRecord />,
        "Пища": <FoodRecord />
    }

    

    React.useEffect(() => {
        props.navigation.dangerouslyGetParent()?.setOptions({ tabBarVisible: false })

        const keysArr: Array<string> = []

        for (let key in el) {
            keysArr.push(key)
        }

        setKeys([...keysArr.map((v,i) => {return i === 0})])
        setKeysName([...keysArr]);

        return (() => {
            props.navigation.dangerouslyGetParent()?.setOptions({ tabBarVisible: true });
            props.ClearRecord();
        })
    }, [])

    React.useEffect(() => {

        props.navigation.setOptions({
            headerRight: () => {
                return (<SaveBtn {...{ ...props.existRecord, SaveRecordFunc }} />)
            }
        })

    }, [props.existRecord])

    React.useEffect(() => {
        
        setView(el[nameView])
    }, [nameView])


    const hideDatePicker = () => {
        setDateView(false);
    };

    const handleConfirm = (date: Date) => {
        if (props.SetDate) {
            props.SetDate(date)
        }
        hideDatePicker();
    };

    const SaveRecordFunc = () => {
        props.SaveRecord();
        props.GetStatistic();
        props.GetRecords();
        props.navigation.goBack();

    }

    return (
        <View style={style.container}>
            <DateTimePickerModal
                isVisible={dateView}
                mode="datetime"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
            />
            <View style={style.timeContainer}>
                <View style={style.timeContainer_info_container}>
                    <Text style={style.timeContainer_info_name}>Время</Text>
                    <Text style={style.timeContainer_info_time}>{props.record.date ? moment(new Date(props.record.date)).locale('ru').format('DD MMMM YYYY hh:mm:ss'):''}</Text>
                </View>
                <TouchableOpacity activeOpacity={0.7} onPress={() => { setDateView(true) }} style={style.timeContainer_btn}>
                    <Image source={require('../../../../../../assets/images/calendar.png')} style={{width:20,height:20, alignSelf:'center', justifyContent:'center', alignItems:'center'}}/>
                </TouchableOpacity>
                {/* <CustomButton title="" onPress={() => { setDateView(true) }} style={style.timeContainer_btn} /> */}
            </View>
            <Hr />
            <View style={style.btnContainer}>
                {keysName.map((name, i) => {
                    return (
                        <BtnRecord key={i} Click={() => setNameView(name)}  text={name} />
                    )
                })}
            </View>
            <Hr />
            <View style={{ flex: 1 }}>
                {view}
            </View>
        </View>
    )
}

const SaveBtn = (props: any) => {

    if (!props.isExist) {
        return null
    } else {
        return (
            <TouchableOpacity
                activeOpacity={0.7}
                style={{ justifyContent: 'center', alignContent: 'center', alignItems: 'center', alignSelf: 'center' }}
                onPress={() => {
                    props.SaveRecordFunc();
                }}>
                <View style={{ height: 40, width: 40, alignSelf: 'center' }}>
                    <View style={{ position: 'absolute', width: 15, height: 15, zIndex: 2, borderRadius: 20, backgroundColor: 'red', justifyContent: 'center', alignContent: 'center', alignItems: 'center', alignSelf: 'flex-end' }}>
                        <Text style={{ color: 'white', fontSize: 10 }}>{props.count}</Text>
                    </View>
                    <Image source={require('../../../../../../assets/images/save2.png')} resizeMethod={'scale'} style={{ width: '100%', height: '100%' }} />
                </View>
            </TouchableOpacity>
        )
    }

}


const BtnRecord = (props: any) => {
    return (
        <View style={{ alignContent: 'center', alignItems: 'center' }}>
            <CustomButton
                style={style.btnView}
                title={props.text[0]}
                colorText={'black'}
                onPress={() => {
                    props.Click();
                }}
            />
            <Text>{props.text}</Text>
        </View>
    )
}

const CreateRecordContainer = (props: any) => {
    return (<CreateRecord {...props} />)
}


const mapStateToProps = (state: IApplicationState) => ({
    record: {
        food: state.CreateRecord.Food,
        glucose: state.CreateRecord.Glucose,
        date: state.CreateRecord.DateCreate
    },
    existRecord: state.CreateRecord.Record
})

const mapDispatchToProps = () => {

}

export default connect(
    mapStateToProps,
    {
        SetDate,
        SetFood,
        SetGlucose,
        ClearRecord,
        SaveRecord,
        GetRecords,
        GetStatistic
    }
)(CreateRecordContainer)

