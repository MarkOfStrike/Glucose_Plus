import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View, ToastAndroid, BackHandler } from 'react-native'
import {GetValueStorage, SetValueStorage} from '../../StorageWork'
import Modal from 'react-native-modal'
// import RNFS from 'react-native-fs'
import { IApplicationState } from '../../Store/StoreInterfaces'
import {SetMeasurement, ImportData, ExportData} from '../../Store/Reducers/SettingTab/Action'
import { connect } from 'react-redux'
import { Input } from '@ui-kitten/components'
import { useBackButton } from '@react-navigation/native'



const SettingTab = (props:any) => {

    // console.log(props.importLoad, props.exportLoad);
    // console.log(props);
    

    const [measuring, setMeasuring] = React.useState<string>(props.measurement)
    const [isOpen, setIsOpen] = React.useState<boolean>(false);

    const [visibleToast, setVisibleToast] = React.useState<boolean>(false);
    const [messageToast, setMessageToast] = React.useState<string>('')

    React.useEffect(() => setVisibleToast(false), [visibleToast]);

    const handleButtonPress = (text:string) => {
        setMessageToast(text);
        setVisibleToast(true);
    };


    React.useEffect(() => {

        props.SetMeasurement(measuring)
        setIsOpen(false);

    }, [measuring])

    return(
        <View style={style.container}>
            {isOpen && <SelectMeasuring Set={setMeasuring} isOpen={isOpen}/>}
            <PushToast visible={visibleToast} message={messageToast}/>
            <TouchableOpacity style={style.sysSet} onPress={() => {
                setIsOpen(true);
            }}>
                <Text>Система измерения</Text>
                <Text>{measuring}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={style.import_export} onPress={() => {
                Promise.all([props.ImportData(), handleButtonPress('Импорт данных выполнен успешно')]);
                // props.ImportData();
                // handleButtonPress('Импорт данных выполнен успешно');
            }}>
                <Text>{props.importLoad ? 'Загрузка...' : 'Импорт данных'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={style.import_export} onPress={() => {
                handleButtonPress('Экспорт данных выполнен успешно');
            }}>
                <Text>Экспорт данных</Text>
            </TouchableOpacity>
        </View>
    )
}

const SelectMeasuring = (props:any) => {

    const mg = 'mg/dl';
    const mmol = 'mmol/l';


    return(
        <Modal isVisible={true} style={{alignSelf:'center'}}>
            <View style={{backgroundColor:'white', width:200, height:100}}>
                <TouchableOpacity style={{padding:10}} onPress={() => {
                    props.Set(mg)
                }}>
                    <Text style={{fontSize:25}}>{mg}</Text>
                </TouchableOpacity>
                <View style={{borderWidth:1, marginTop:1, marginBottom:1}}></View>
                <TouchableOpacity style={{padding:10, paddingTop:0}} onPress={() => {
                    props.Set(mmol)
                }}>
                    <Text style={{fontSize:25}}>{mmol}</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    )

}

interface IToastProps {
    visible: boolean
    message:string
}

const PushToast = ({ visible, message }:IToastProps) => {
    if (visible) {
      ToastAndroid.showWithGravityAndOffset(
        message,
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
      return null;
    }
    return null;
  };

const style = StyleSheet.create({
    container:{
        marginTop: 5, 
        borderWidth: 1, 
        height: '100%',
    },
    sysSet: {
        borderWidth: 1, 
        // marginTop: 5,
        margin:5, 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        height: '10%', 
        alignItems:'center'
    },
    import_export: {
        borderWidth: 1, 
        // marginTop: 5,
        margin:5, 
        height: '10%', 
        flexDirection: 'row', 
        alignItems:'center', 
        justifyContent:'flex-start'
    }
})

const SettingTabContainer = (props:any) => {
    return(
        <SettingTab {...props}/>
    )
}

const mapStateToProps = (state:IApplicationState) => ({
    measurement: state.SettingTab.measurement,
    importLoad: state.SettingTab.loading.import,
    exportLoad: state.SettingTab.loading.export
})

export default connect(
    mapStateToProps,
    {
        SetMeasurement,
        ImportData,
        ExportData
    }
)(SettingTabContainer)

// export default SettingTab;