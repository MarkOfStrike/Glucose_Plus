import moment from 'moment';
import 'moment/locale/ru'
import React from 'react';
import { Button, ScrollView, Text, View } from 'react-native';
import { connect } from 'react-redux';

import { IProduct } from '../../../DataBase/Models/Product';
import { TypeRecord } from '../../../Interfaces/IDiary';
import { GetRecords, GetStatistic } from '../../../Store/Reducers/Diary/Action';
import { DeleteRecord, GetInfo } from '../../../Store/Reducers/MoreDetailsOfRecord/Action';
import { IApplicationState } from '../../../Store/StoreInterfaces';
import CustomButton from '../../CustomElement/CustomButton';
import Hr from '../../CustomElement/Hr';

const MoreDetailsOfRecord = (props: any) => {

    switch (props.currentType as TypeRecord) {
        case TypeRecord.Glucose:
            return (
                <DetailsGlucose {...props.record} Delete={props.deleteRecord} measurement={props.measurement}  />
            )
        case TypeRecord.Product:
            return (
                <DetailsFood {...props.record} Delete={props.deleteRecord} />
            )

        default:
            return (
                <View></View>
            )
    }
}

const DetailsGlucose = (props: any) => {

    const [level, setLevel] = React.useState(props.level);

    React.useEffect(() => {

        let tmp = props.level;

    if (props.measurement === 'mmol/l') {
        tmp /= 18;
    }

    setLevel(tmp);

    },[])

    return (
        <View>
            <View style={{padding: 5}}>
                <Text style={{marginTop:5}}>Время создания: {moment(new Date(props.date)).locale('ru').format('DD MMMM YYYYг. hh:mm:ss')}</Text>
                <Text style={{marginTop:5}}>Уровень глюкозы: {level.toFixed(2)} {props.measurement}</Text>
            </View>
            <CustomButton style={{width: 150, height:35, backgroundColor: '#84C2AA', borderRadius: 10, alignItems:'center', justifyContent:'center', alignSelf:'center', marginVertical:10, marginRight: 5}} title={'Удалить запись'} onPress={() => {
                    props.Delete(); 
                }}/>
        </View>
    )
}

const DetailsFood = (props: any) => {

    const font = 14;

    return (
        <View>
            <View style={{paddingLeft: 5, paddingTop: 5}}>
                <Text>Название: {props.name}</Text>
                <Text>Время создания: {moment(new Date(parseInt(props.date))).locale('ru').format('DD MMMM YYYYг. hh:mm:ss')}</Text>
                <Text>Инсулин: {props.insulin}</Text>
                <Text>Углеводный коэффициент: {props.yk}</Text>
                <Text style={{ fontSize: font }}>Калл:{props.sumValue.Calories}</Text>
                <Text style={{ fontSize: font }}>ГИ:{props.sumValue.Gi}</Text>
                <Text style={{ fontSize: font }}>ХЕ:{props.sumValue.Xe.toFixed(2)}</Text>
                <Text style={{ fontSize: font }}>Б:{props.sumValue.Proteins}</Text>
                <Text style={{ fontSize: font }}>Ж:{props.sumValue.Fats}</Text>
                <Text style={{ fontSize: font }}>У:{props.sumValue.Carbohydrates}</Text>
                <Text>Вес продукта: {props.weight}г.</Text>
                <CustomButton style={{width: 150, height:35, backgroundColor: '#84C2AA', borderRadius: 10, alignItems:'center', justifyContent:'center', alignSelf:'flex-end', marginVertical:5, marginRight: 5}} title={'Удалить запись'} onPress={() => {
                    props.Delete(); 
                }}/>
            </View>
            <Hr />
            <ScrollView>
                {props.products.map((v: any, i: number) => {
                    return (
                        <ProductRecord key={i} productInfo={v} />
                    )
                })}
            </ScrollView>
        </View>
    )
}

const ProductRecord = (props: any) => {

    return (
        // <View style={{ marginTop: 5, borderWidth: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
        //     <View style={{ borderWidth: 1, borderColor: 'yellow', width: '75%' }}>
        //         <ProductView {...props.productInfo.product} />
        //     </View>
        //     <View style={{ borderWidth: 1, borderColor: 'red', width: '25%', paddingRight: 5, paddingLeft: 5, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        //         <Text>Вес: {props.productInfo.weight}г.</Text>
        //     </View>
        // </View>
        <View style={{ marginTop: 5,  flexDirection: 'row', justifyContent: 'space-between', borderBottomLeftRadius: 20, borderBottomRightRadius:20, borderWidth:1, borderTopWidth:0, borderColor:'#578B9E' }}>
        <View style={{width: '75%',}}>
            {/* <Text>{}</Text> */}
            <ProductView {...props.productInfo.product} />
        </View>
        <View style={{width: '25%', 
        paddingRight: 5, 
        paddingLeft: 5, 
        // flexDirection: 'row', 
        justifyContent: 'center', 
        alignItems: 'center',
        alignContent:'center'}}>
            <Text style={{textAlign:'right', alignSelf:'center'}}>Вес: {props.productInfo.weight}г.</Text>
        </View>
    </View>
    )
}

const ProductView = (product: IProduct) => {
    return (
        <View style={{  padding: 5 }}>
            <Text style={{ fontSize: 18, color:'#549C5A' }}>{product.Name}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 3 }}>
                <Text style={{ fontSize: 11, color:'grey' }}>Калл:{product.Calories}</Text>
                <Text style={{ fontSize: 11, color:'grey'}}>ГИ:{product.Gi}</Text>
                <Text style={{ fontSize: 11, color:'grey' }}>ХЕ:{product.Xe}</Text>
                <Text style={{ fontSize: 11, color:'grey' }}>Б:{product.Proteins}</Text>
                <Text style={{ fontSize: 11, color:'grey' }}>Ж:{product.Fats}</Text>
                <Text style={{ fontSize: 11, color:'grey' }}>У:{product.Carbohydrates}</Text>
            </View>
        </View>
    )
}



const MoreDetailsOfRecordContainer = (props: any) => {

    React.useEffect(() => {
        props.navigation.dangerouslyGetParent()?.setOptions({ tabBarVisible: false })
        return (() => {
            props.navigation.dangerouslyGetParent()?.setOptions({ tabBarVisible: true });
        })
    }, [])

    React.useEffect(() => {
        const params = props.route.params;
        props.GetInfo(params.id, params.type);
    }, [props.GetInfo])

    const deleteRecord = () => {
        const params = props.route.params;
        props.DeleteRecord(params.id, params.type)
        props.GetStatistic()
        props.GetRecords()
        props.navigation.goBack();
    }

    if (!props.record) {
        return null;
    }

    return (
        <MoreDetailsOfRecord {...props} deleteRecord={deleteRecord} />
    )
}


const mapStateToProps = (state: IApplicationState) => ({
    currentType: state.MoreDetailsOfRecord.typeRecord,
    record: state.MoreDetailsOfRecord.info,
    measurement: state.SettingTab.measurement,
})

export default connect(
    mapStateToProps,
    {
        GetInfo,
        DeleteRecord,
        GetRecords,
        GetStatistic
    }
)(MoreDetailsOfRecordContainer)



