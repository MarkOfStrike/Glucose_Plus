import React, { FC } from 'react'
import { View, Text, TextInput, Pressable, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native'
import { IProduct } from '../../../../../../../DataBase/Models/Product';
import Modal from 'react-native-modal'
import CustomButton from '../../../../../../CustomElement/CustomButton';
import { Picker } from '@react-native-picker/picker'
import Hr from '../../../../../../CustomElement/Hr';
import { connect } from 'react-redux';
import { IApplicationState } from '../../../../../../../Store/StoreInterfaces';
import {GetSearchProduct, ClearState} from '../../../../../../../Store/Reducers/AddProduct/Action'
// import ReactDOM from 'react-dom'
import { compose } from 'redux';

interface IAddProduct {
    isOpen: boolean
    Close: () => void
    SelectedItem?: (product: IProduct) => void
}

enum Group {
    All, Fruits, Vegetables
}

const AddContainer = (props:any) => {
    return <AddProduct {...props}/>
}

// const AddProduct: FC<IAddProduct> = ({ isOpen, Close, SelectedItem }) => {
const AddProduct = (props:any) => {

    // console.log(props);
    

    const [selectedItem, setSelectedItem] = React.useState<Group>(Group.All);

    React.useEffect(() => {
        return(() => {
            props.ClearState();
        })
    },[])

    React.useEffect(() => {
        props.GetSearchProduct(props.Ids)
    }, [props.GetSearchProduct])

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
                            props.GetSearchProduct(props.Ids, text);
                        }} />
                        <Image source={require('../../../../../../../../assets/images/otherIcon/searchIcon.png')} style={{ width: 20, height: 20, alignSelf: 'center', borderWidth: 1 }} />
                    </View>
                    <View style={{ borderWidth: 1, marginTop: 10, borderRadius: 15, flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 5 }}>
                        <Text style={{ alignSelf: 'center' }}>Группа:</Text>
                        <Picker selectedValue={selectedItem} onValueChange={v => setSelectedItem(v)} style={{ color: 'red', width: '80%' }}>
                            <Picker.Item label={"Все"} value={Group.All} />
                            <Picker.Item label={"Фрукты"} value={Group.Fruits} />
                            <Picker.Item label={"Овощи"} value={Group.Vegetables} /> 
                        </Picker>
                    </View>
                    <View style={{ height: '75%', marginTop: 10 }}>
                        <ScrollView>
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
            console.log(props.product.Id);
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
    Products: state.AddProduct.ProductsList
})

export default compose(connect(
    mapStateToProps,
    {
        GetSearchProduct,
        ClearState

    }))(AddContainer)