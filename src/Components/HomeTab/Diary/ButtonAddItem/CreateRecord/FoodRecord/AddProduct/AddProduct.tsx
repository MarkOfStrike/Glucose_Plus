import React, { FC } from 'react';
import {
    Image, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View
} from 'react-native';
import Modal from 'react-native-modal';
import { connect } from 'react-redux';
// import ReactDOM from 'react-dom'
import { compose } from 'redux';

import { Picker } from '@react-native-picker/picker';

import { IProduct } from '../../../../../../../DataBase/Models/Product';
import {
    ClearSkip, ClearState, GetSearchProduct, IncrementSkip, SetGroupProductSearch
} from '../../../../../../../Store/Reducers/AddProduct/Action';
import { Group } from '../../../../../../../Store/Reducers/AddProduct/Reducer';
import { IApplicationState } from '../../../../../../../Store/StoreInterfaces';
import CustomButton from '../../../../../../CustomElement/CustomButton';
import Hr from '../../../../../../CustomElement/Hr';

interface IAddProduct {
    isOpen: boolean
    Close: () => void
    SelectedItem?: (product: IProduct) => void
}



const AddContainer = (props:any) => {
    return <AddProduct {...props}/>
}

// const AddProduct: FC<IAddProduct> = ({ isOpen, Close, SelectedItem }) => {
const AddProduct = (props:any) => {

    
    const [searchText, setSearchText] = React.useState<string>('');

    React.useEffect(() => {
        return(() => {
            props.ClearState();
        })
    },[])

    React.useEffect(() => {
        props.GetSearchProduct(props.Ids)
    }, [props.GetSearchProduct])

    React.useEffect(()=> {

        const timer = setTimeout(() => {
            props.ClearSkip();
            props.GetSearchProduct(props.Ids, searchText)
        }, 1500)

        return(() => {
            clearTimeout(timer);
        })
    },[searchText])

    const addFunc = (product:IProduct) => {
        props.Add(product);
        props.Close();
    }

    return (
        <Modal isVisible={/*props.isOpen*/true} animationIn={'zoomInLeft'} style={{ width: '80%', height: '100%', alignSelf: 'center' }}>
            <View style={{
                width: "100%", height: '100%', borderRadius: 20, backgroundColor: 'white', alignItems: "center",
                shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: 2
                },
                shadowOpacity: 0.25,
                shadowRadius: 4,
                elevation: 5,
                padding: 10
            }}>
                <View style={{ borderWidth: 1, width: '100%', height: 35, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', alignContent: 'center', alignSelf: 'center', borderRadius: 20, }}>
                    <Text style={{ marginLeft: 5, alignSelf: 'center', fontSize: 13 }}>{'Добавление ингридиента...'}</Text>
                    <Pressable
                        style={{ borderRadius: 20, backgroundColor: '#d0e3f7', alignSelf: 'flex-end', width: '12%', height: '100%', alignItems: 'center', justifyContent: 'center' }}
                        onPress={() => props.Close()}
                    >
                        <Image source={require('../../../../../../../../assets/images/otherIcon/cancelBtn.png')} style={{ width: 33, height: 33 }} />
                    </Pressable>
                </View>
                <View style={{ width: '100%', height: '83%' }}>

                    <View style={{ flexDirection: 'row', marginTop: 20, borderRadius: 10, borderWidth: 1, paddingRight: 5, paddingLeft: 5, justifyContent: 'space-between' }}>
                        <TextInput style={{ width: '90%', flexDirection: 'row', justifyContent: 'space-between' }} placeholder={"Начните вводить..."} onChangeText={text => {
                            setSearchText(text);
                        }} />
                        <Image source={require('../../../../../../../../assets/images/otherIcon/searchIcon.png')} style={{ width: 20, height: 20, alignSelf: 'center', borderWidth: 1 }} />
                    </View>
                    <View style={{ borderWidth: 1, marginTop: 10, borderRadius: 15, flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 5 }}>
                        <Text style={{ alignSelf: 'center' }}>Группа:</Text>
                        <Picker selectedValue={props.GroupProduct as Group} onValueChange={v => {
                            props.SetGroupProductSearch(v);
                            props.ClearSkip();
                            props.GetSearchProduct(props.Ids, searchText)

                        }} style={{ color: 'red', width: '80%' }}>
                            {Object.values(Group).map((v, i) => { return v.toString() }).map((str, i) => {
                                
                                return (
                                    <Picker.Item key={i} label={str} value={str as Group} />
                                )

                            })}
                            {/* <Picker.Item label={Group.All.toString()} value={Group.All} />
                            <Picker.Item label={Group.Fruits_and_berries.toString()} value={Group.Fruits_and_berries} />
                            <Picker.Item label={"Овощи"} value={Group.Vegetables} />  */}
                        </Picker>
                    </View>
                    <View style={{ height: '75%', marginTop: 10 }}>
                        <ScrollView onScroll={(event) => {

                            const current = event.nativeEvent;

                            if(current.contentOffset.y + current.layoutMeasurement.height >= current.contentSize.height - 2){
                                props.IncrementSkip();
                                props.GetSearchProduct(props.Ids, searchText)
                            }
                        }}>
                            {props.Products.map((v: any, i: number) => {

                                const product = v as IProduct;

                                return (<ProductView key={i} product={product} addFunc={addFunc}/>
                                )
                            })}
                        </ScrollView>
                    </View>
                </View>
                <View style={{ width: '100%', borderWidth: 0.5, borderColor: '#dcdcdc' }} />
                <View style={{ width: '100%', height: '10%', justifyContent: 'center', alignItems: 'center' }}>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        style={{ borderRadius: 15, backgroundColor: '#ff033e', alignContent: 'center', width: '70%', height: '60%', alignItems: 'center', justifyContent: 'center' }}
                        onPress={() => props.Close()}
                    >
                        <Text>Отмена</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}

const ProductView = (props:any) => {
    return (
        <TouchableOpacity activeOpacity={0.5} onPress={() => {
            props.addFunc(props.product)
        }}>
            <View style={{ borderWidth: 1, padding: 5, marginBottom: 10 }}>
                <Text style={{ fontSize: 14 }}>{props.product.Name}</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 10 }}>Калл:{props.product.Calories}</Text>
                    <Text style={{ fontSize: 10 }}>ГИ:{props.product.Gi}</Text>
                    <Text style={{ fontSize: 10 }}>ХЕ:{props.product.Xe}</Text>
                    <Text style={{ fontSize: 10 }}>Б:{props.product.Proteins}</Text>
                    <Text style={{ fontSize: 10 }}>Ж:{props.product.Fats}</Text>
                    <Text style={{ fontSize: 10 }}>У:{props.product.Carbohydrates}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const mapStateToProps = (state: IApplicationState) => ({
    Products: state.AddProduct.ProductsList,
    GroupProduct: state.AddProduct.Category
})

export default compose(connect(
    mapStateToProps,
    {
        GetSearchProduct,
        ClearState,
        SetGroupProductSearch,
        ClearSkip, 
        IncrementSkip

    }))(AddContainer)