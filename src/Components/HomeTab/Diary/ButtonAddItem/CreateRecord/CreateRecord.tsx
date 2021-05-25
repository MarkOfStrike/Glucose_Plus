import React from 'react'
import { Text, View, TextInput, ScrollView } from 'react-native'
import CustomButton from '../../../../CustomElement/CustomButton';
import Hr from '../../../../CustomElement/Hr';
import style from './CreateRecordStyle';
import FoodRecord from './FoodRecord/FoodRecord';
import GlucoseRecord from './GlucoseRecord/GlucoseRecord';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { IDictionary } from '../../../../../Interfaces/IDictionary';
import { IProduct } from '../../../../../DataBase/Models/Product';

const CreateRecord = (props: any) => {

    const [dateView, setDateView] = React.useState<boolean>(false);
    const [dateValue, setDateValue] = React.useState<string>('');

    const [view, setView] = React.useState(<View></View>)
    const [nameView, setNameView] = React.useState<string>('Глюкоза')

    const el: IDictionary<JSX.Element> = {
        "Глюкоза": <GlucoseRecord />,
        "Пища": <FoodRecord />
    }

    const keys: Array<string> = []

    for (let key in el) {
        keys.push(key)
    }

    React.useEffect(() => {
        props.navigation.dangerouslyGetParent()?.setOptions({ tabBarVisible: false })

        return (() => {
            props.navigation.dangerouslyGetParent()?.setOptions({ tabBarVisible: true });
        })
    }, [])

    React.useEffect(() => {
        setView(el[nameView])
    }, [nameView])


    const hideDatePicker = () => {
        setDateView(false);
      };
    
    const handleConfirm = (date:Date) => {
        console.log("A date has been picked: ", date);
        setDateValue(date.toString());
        hideDatePicker();
      };



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
                    <Text style={style.timeContainer_info_time}>{dateValue}</Text>
                </View>
                <CustomButton title="" onPress={() => {setDateView(true)}} style={style.timeContainer_btn}/>
            </View>
            <Hr/>
            <View style={style.btnContainer}>
                {keys.map((name, i) => {
                    return (
                        <BtnRecord key={i} Click={() => setNameView(name)} text={name} />
                    )
                })}
            </View>
            <Hr />
            <View style={{borderWidth: 2, borderColor: '#7d9e9a', flex: 1}}>
                {view}
            </View>
        </View>
    )
}

const BtnRecord = (props: any) => {
    return (
        <View style={{ alignContent: 'center', alignItems: 'center' }}>
            <CustomButton
                style={style.btnView}
                title={'I'}
                colorText={'black'}
                onPress={() => {
                    props.Click();
                }}
            />
            <Text>{props.text}</Text>
        </View>
    )
}

export default CreateRecord;