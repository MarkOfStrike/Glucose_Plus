import React, { FC } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Swipeout, { SwipeoutButtonProperties } from 'react-native-swipeout';
import TextInputMask from 'react-native-text-input-mask';
import { connect, MapStateToProps } from 'react-redux';

import { IProduct } from '../../../../../../DataBase/Models/Product';
import { SetFood } from '../../../../../../Store/Reducers/CreateRecord/Action';
import { ICreateFood, IRecordProduct } from '../../../../../../Store/Reducers/CreateRecord/Reducer';
import { IApplicationState } from '../../../../../../Store/StoreInterfaces';
import CustomButton from '../../../../../CustomElement/CustomButton';
import Hr from '../../../../../CustomElement/Hr';
import AddProduct from './AddProduct/AddProduct';
import { style } from './FoodRecordStyle';

// import {} from 'react-native-swipeable-rowexpo'



const FoodRecord = (props: any) => {

    const [nameFood, setNameFood] = React.useState<string>('');
    const [insulinLevel, setInsulinLevel] = React.useState<string>('');

    const [isModal, setIsModal] = React.useState<boolean>(false)

    const [products, setProducts] = React.useState<Array<IRecordProduct>>([]);
    const [idProducts, setIdProducts] = React.useState<Array<number>>([]);

    const CloseModal = () => setIsModal(false);

    const AddProductToList = (product: IProduct) => {

        setProducts([...products, { product, weight: '' }])
        setIdProducts([...idProducts, product.Id as number])

    }

    const DeleteProductToList = (index: number) => {

        const newMas = products.filter((v, i) => i != index);

        setProducts(newMas);
        setIdProducts([...newMas.map((v, i) => v.product.Id as number)])

    }

    const SetWeight = (weight: string, index: number) => {

        const mas = products.map((product, i) => {
            if (i === index) {
                product.weight = weight
            }

            return product
        })

        setProducts(mas);
    }

    React.useEffect(() => {

        if (nameFood !== '' && insulinLevel !== '' && products.length > 0) {

            const food: ICreateFood = {
                name: nameFood,
                insulinLevel,
                products: products
            }

            props.SetFood(food)

        }
    }, [nameFood, products, insulinLevel])


    return (
        <View style={style.container}>

            {isModal && <AddProduct isOpen={isModal} Close={CloseModal} Add={AddProductToList} Ids={idProducts} />}

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 5 }}>
                <Text>???????? ????????????????</Text>
                <TextInput placeholder={'---'} keyboardType={'numeric'} style={{ borderBottomWidth: 1, width: 100 }} onChangeText={setInsulinLevel} />
                {/* <TextInputMask
                    onChangeText={(formatted, extracted) => {
                        console.log(formatted) // +1 (123) 456-78-90
                        console.log(extracted) // 1234567890
                    }}
                    mask={"+1 ([000]) [000] [00] [00]"}
                /> */}
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 5 }}>
                <Text>????????????????</Text>
                <TextInput placeholder={'?????????????? ????????????????...'} style={{ borderBottomWidth: 1, width: 150 }} onChangeText={setNameFood} />
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, padding: 5 }}>
                <Text>??????????????????????</Text>
                <CustomButton style={style.addBtnProduct} title='????????????????' onPress={() => { setIsModal(true) }} />
            </View>

            <Hr />

            <ScrollView style={{ marginRight: 2, marginLeft: 2 }}>
                {products.map((record, i) => {
                    return (
                        <ListProduct key={i} productInfo={record} setWeight={SetWeight} index={i} Delete={DeleteProductToList} />
                    )
                })}
            </ScrollView>

        </View>
    )
}

interface IListProductProps {
    productInfo: IRecordProduct
    index: number
    Delete: (index: number) => void
    setWeight: (weight: string, index: number) => void
}



const ListProduct: FC<IListProductProps> = (props) => {

    // console.log(props);


    const [textValue, setTextValue] = React.useState<string>(props.productInfo.weight);

    const deleteBtn: SwipeoutButtonProperties = {
        text: 'X',
        type: 'delete',
        onPress: () => {
            props.Delete(props.index)

        },
    }

    React.useEffect(() => {
        props.setWeight(textValue, props.index);
    }, [textValue]);

    return (
        <Swipeout right={[deleteBtn]} style={{backgroundColor: 'rgba(0,0,0,0)'}} autoClose={true} close={true} onOpen={() => { }} onClose={() => { }}>
            <View style={{ marginTop: 5,  flexDirection: 'row', justifyContent: 'space-between', borderBottomLeftRadius: 20, borderBottomRightRadius:20, borderWidth:1, borderTopWidth:0, borderColor:'#578B9E' }}>
                <View style={style.infoProduct}>
                    {/* <Text>{}</Text> */}
                    <ProductView {...props.productInfo.product} />
                </View>
                <View style={style.inputProduct}>
                    <Text>??????:</Text>
                    <TextInput
                        placeholder={'----'}
                        style={{ borderBottomWidth: 1 }}
                        value={textValue}
                        onChangeText={text => setTextValue(text)}
                        maxLength={4}
                        keyboardType={'numeric'}
                    />
                    <Text>??.</Text>
                </View>
            </View>
        </Swipeout>
    )
}

const ProductView = (product: IProduct) => {
    return (
        <View style={{  padding: 5 }}>
            <Text style={{ fontSize: 18, color:'#549C5A' }}>{product.Name}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 3 }}>
                <Text style={{ fontSize: 11, color:'grey' }}>????????:{product.Calories}</Text>
                <Text style={{ fontSize: 11, color:'grey'}}>????:{product.Gi}</Text>
                <Text style={{ fontSize: 11, color:'grey' }}>????:{product.Xe}</Text>
                <Text style={{ fontSize: 11, color:'grey' }}>??:{product.Proteins}</Text>
                <Text style={{ fontSize: 11, color:'grey' }}>??:{product.Fats}</Text>
                <Text style={{ fontSize: 11, color:'grey' }}>??:{product.Carbohydrates}</Text>
            </View>
        </View>
    )
}


const FoodRecordContainer = (props: any) => {
    return (<FoodRecord {...props} />)
}


const mapStateToProps = (state: IApplicationState) => ({

})

export default connect(
    mapStateToProps,
    {

        SetFood

    })(FoodRecordContainer);