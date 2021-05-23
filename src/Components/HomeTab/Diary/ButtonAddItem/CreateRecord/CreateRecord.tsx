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

const Level = () => {
    return (
        <View style={{height:'100%', borderWidth: 1, borderColor: 'red'}}>
            <Text>Введите значение</Text>
            <View style={{ flexDirection: "row" }}>
                <TextInput
                    textAlign="right"
                    maxLength={3}
                    keyboardType="numeric"
                    textAlignVertical="top"
                    style={{ marginRight: 5 }}
                    placeholder="---"
                    onBlur={(e) => {
                        console.log(e);
                    }}
                    onChangeText={text => console.log(text)} />

                <Text>mg/dL</Text>
            </View>
        </View>
    )
}

const Food = () => {
    return (
        <View style={{height:'100%', borderWidth: 1, borderColor: 'yellow'}}>

            <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                <Text>Название</Text>
                <TextInput placeholder={'Введите название...'} style={{borderBottomWidth: 1, width: 150}}/>
            </View>

            <View style={{flexDirection: 'row', justifyContent:'space-between', marginTop: 20}}>
                <Text>Ингредиенты</Text>
                <CustomButton style={{borderRadius: 10,
                                        backgroundColor: '#0f8a7f',
                                        paddingTop: 10,
                                        paddingBottom: 10,
                                        paddingLeft: 35,
                                        paddingRight: 35,}} title='Добавить' onPress={() => {}}/>
            </View>

            <Hr/>

            <ScrollView style={{borderWidth:1}}>
                {[...Array(100)].map((v, i) => {
                    return(
                        <Text key={i}>AASDASDASD</Text>
                    )
                })}
            </ScrollView>

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