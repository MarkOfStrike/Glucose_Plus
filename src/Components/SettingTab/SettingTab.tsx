import React from 'react';
import { StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';
import { connect } from 'react-redux';

import { ExportData, ImportData, SetMeasurement } from '../../Store/Reducers/SettingTab/Action';
import { IApplicationState } from '../../Store/StoreInterfaces';

const SettingTab = (props: any) => {


    const [measuring, setMeasuring] = React.useState<string>(props.measurement)
    const [isOpen, setIsOpen] = React.useState<boolean>(false);

    const [visibleToast, setVisibleToast] = React.useState<boolean>(false);
    const [messageToast, setMessageToast] = React.useState<string>('')

    React.useEffect(() => setVisibleToast(false), [visibleToast]);

    React.useEffect(() => {

        setMessageToast(props.importToast.message)
        setVisibleToast(props.importToast.show)

    }, [props.importToast.show])

    React.useEffect(() => {

        setMessageToast(props.exportToast.message)
        setVisibleToast(props.exportToast.show)

    }, [props.exportToast.show])

    React.useEffect(() => {

        props.SetMeasurement(measuring)
        setIsOpen(false);

    }, [measuring])

    return (
        <View style={style.container}>
            {isOpen && <SelectMeasuring Set={setMeasuring} isOpen={isOpen} />}
            <PushToast visible={visibleToast} message={messageToast} />
            <TouchableOpacity style={style.sysSet} onPress={() => {
                setIsOpen(true);
            }}>
                <Text style={{fontSize:16}}>Система измерения</Text>
                <Text style={{color:'green'}}>{measuring}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={style.import_export} onPress={() => {
                props.ImportData()
            }}>
                <Text style={{fontSize:16}}>{props.importLoad ? 'Загрузка...' : 'Импорт данных'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={style.import_export} onPress={() => {
                props.ExportData();
            }}>
                <Text style={{fontSize:16}}>Экспорт данных</Text>
            </TouchableOpacity>
        </View>
    )
}

const SelectMeasuring = (props: any) => {

    const mg = 'mg/dL';
    const mmol = 'mmol/l';


    return (
        <Modal isVisible={true} style={{ alignSelf: 'center' }}>
            <View style={{ backgroundColor: 'white', width: 200, height: 100 }}>
                <TouchableOpacity style={{ padding: 10 }} onPress={() => {
                    props.Set(mg)
                }}>
                    <Text style={{ fontSize: 25 }}>{mg}</Text>
                </TouchableOpacity>
                <View style={{ borderWidth: 1, marginTop: 1, marginBottom: 1 }}></View>
                <TouchableOpacity style={{ padding: 10, paddingTop: 0 }} onPress={() => {
                    props.Set(mmol)
                }}>
                    <Text style={{ fontSize: 25 }}>{mmol}</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    )

}

interface IToastProps {
    visible: boolean
    message: string
}

const PushToast = ({ visible, message }: IToastProps) => {
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
    container: {
        // marginTop: 5,
        // borderWidth: 1,
        height: '100%',
    },
    sysSet: {
        borderWidth: 1,
        margin: 4,
        borderRadius: 10,
        paddingHorizontal:5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: '10%',
        alignItems: 'center'
    },
    import_export: {
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 5,
        margin: 4,
        height: '10%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
    }
})

const SettingTabContainer = (props: any) => {
    return (
        <SettingTab {...props} />
    )
}

const mapStateToProps = (state: IApplicationState) => ({
    measurement: state.SettingTab.measurement,
    importToast: state.SettingTab.importToast,
    exportToast: state.SettingTab.exportToast
})

export default connect(
    mapStateToProps,
    {
        SetMeasurement,
        ImportData,
        ExportData
    }
)(SettingTabContainer)