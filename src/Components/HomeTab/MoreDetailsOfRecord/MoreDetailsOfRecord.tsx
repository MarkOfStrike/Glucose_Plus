import moment from 'moment';
import React from 'react';
import { Button, ScrollView, Text, View } from 'react-native';
import { connect } from 'react-redux';

import { IProduct } from '../../../DataBase/Models/Product';
import { TypeRecord } from '../../../Interfaces/IDiary';
import { GetRecords, GetStatistic } from '../../../Store/Reducers/Diary/Action';
import { DeleteRecord, GetInfo } from '../../../Store/Reducers/MoreDetailsOfRecord/Action';
import { IApplicationState } from '../../../Store/StoreInterfaces';
import Hr from '../../CustomElement/Hr';

const MoreDetailsOfRecord = (props: any) => {

    switch (props.currentType as TypeRecord) {
        case TypeRecord.Glucose:
            return (
                <DetailsGlucose {...props.record} Delete={props.deleteRecord} />
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

    return (
        <View>
            <View>
                <Text>Время создания: {moment(new Date(props.date)).format('DD.MM.YYYYг. hh:mm:ss')}</Text>
                <Text>Уровень захара: {props.level}</Text>
            </View>
            <Button title={'Удалить'} onPress={() => {
                props.Delete();
                console.log('DELETE');

            }} />
        </View>
    )
}

const DetailsFood = (props: any) => {

    const font = 14;

    return (
        <View>
            <View>
                <Text>Название: {props.name}</Text>
                <Text>Время создания: {moment(new Date(parseInt(props.date))).format('DD.MM.YYYYг. hh:mm:ss')}</Text>
                <Text>Инсулин: {props.insulin}</Text>
                <Text>Углеводный коэффициент: {props.yk}</Text>
                <Text style={{ fontSize: font }}>Калл:{props.sumValue.Calories}</Text>
                <Text style={{ fontSize: font }}>ГИ:{props.sumValue.Gi}</Text>
                <Text style={{ fontSize: font }}>ХЕ:{props.sumValue.Xe.toFixed(2)}</Text>
                <Text style={{ fontSize: font }}>Б:{props.sumValue.Proteins}</Text>
                <Text style={{ fontSize: font }}>Ж:{props.sumValue.Fats}</Text>
                <Text style={{ fontSize: font }}>У:{props.sumValue.Carbohydrates}</Text>
                <Text>Вес продукта: {props.weight}</Text>
                <Button color={'#e6192b'} title={'Удалить'} onPress={() => {
                    props.Delete();
                    console.log('DELETE');

                }} />
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
        <View style={{ marginTop: 5, borderWidth: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ borderWidth: 1, borderColor: 'yellow', width: '75%' }}>
                <ProductView {...props.productInfo.product} />
            </View>
            <View style={{ borderWidth: 1, borderColor: 'red', width: '25%', paddingRight: 5, paddingLeft: 5, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text>Вес: {props.productInfo.weight}г.</Text>
            </View>
        </View>
    )
}

const ProductView = (product: IProduct) => {
    return (
        <View style={{ borderWidth: 1, padding: 5 }}>
            <Text style={{ fontSize: 16 }}>{product.Name}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 3 }}>
                <Text style={{ fontSize: 11 }}>Калл:{product.Calories}</Text>
                <Text style={{ fontSize: 11 }}>ГИ:{product.Gi}</Text>
                <Text style={{ fontSize: 11 }}>ХЕ:{product.Xe}</Text>
                <Text style={{ fontSize: 11 }}>Б:{product.Proteins}</Text>
                <Text style={{ fontSize: 11 }}>Ж:{product.Fats}</Text>
                <Text style={{ fontSize: 11 }}>У:{product.Carbohydrates}</Text>
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
    record: state.MoreDetailsOfRecord.info
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



