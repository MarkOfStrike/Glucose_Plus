import React, { FC } from 'react'
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { IProduct } from '../../../../../../DataBase/Models/Product';
import CustomButton from '../../../../../CustomElement/CustomButton';
import Hr from '../../../../../CustomElement/Hr';
import AddProduct from './AddProduct/AddProduct';
import { style } from './FoodRecordStyle';
import Swipeout, { SwipeoutButtonProperties }  from 'react-native-swipeout'
import { connect, MapStateToProps } from 'react-redux';
import { IApplicationState } from '../../../../../../Store/StoreInterfaces';
import { ICreateFood, IRecordProduct } from '../../../../../../Store/Reducers/CreateRecord/Reducer';
import {SetFood} from '../../../../../../Store/Reducers/CreateRecord/Action'
// import {} from 'react-native-swipeable-rowexpo'



const FoodRecord = (props:any) => {

    const [nameFood, setNameFood] = React.useState<string>('');

    const [isModal, setIsModal] = React.useState<boolean>(false)

    const [products, setProducts] = React.useState<Array<IRecordProduct>>([]);
    const [idProducts, setIdProducts] = React.useState<Array<number>>([]);

    const CloseModal = () => setIsModal(false);

    const AddProductToList = (product:IProduct) => {

        setProducts([...products, {product, weight: ''}])
        setIdProducts([...idProducts, product.Id as number])

    }

    const DeleteProductToList = (index:number) => {

        const newMas = products.filter((v,i) => i != index);

        setProducts(newMas);
        setIdProducts([...newMas.map((v,i) => v.product.Id as number)])

    }
    
    React.useEffect(() => {

        const food:ICreateFood = {
            name: nameFood,
            products: products
        }

        console.log(food);
        

        props.SetFood(food)

    }, [nameFood, products])


    return (
        <View style={style.container}>

            {isModal && <AddProduct isOpen={isModal} Close={CloseModal} Add={AddProductToList} Ids={idProducts}/>}

            <View style={{flexDirection:'row', justifyContent:'space-between', padding: 5}}>
                <Text>Название</Text>
                <TextInput placeholder={'Введите название...'} style={{borderBottomWidth: 1, width: 150}}  onChangeText={setNameFood}/>
            </View>

            <View style={{flexDirection: 'row', justifyContent:'space-between', marginTop: 20, padding: 5}}>
                <Text>Ингредиенты</Text>
                <CustomButton style={style.addBtnProduct} title='Добавить' onPress={() => {setIsModal(true)}}/>
            </View>

            <Hr/>

            <ScrollView style={{marginRight: 2, marginLeft: 2}}>
                {products.map((record, i) => {
                    return(
                        <ListProduct key={i} productInfo={record} index={i} Delete={DeleteProductToList}/>
                    )
                })}
            </ScrollView>

        </View>
    )
}

interface IListProductProps {
    productInfo: IRecordProduct
    index: number
    Delete: (index:number) => void
}

const ListProduct:FC<IListProductProps> = (props) => {

    // console.log(props);
    

    const [textValue, setTextValue] = React.useState<string>(props.productInfo.weight);

    const deleteBtn:SwipeoutButtonProperties = {
        text: 'X',
        type: 'delete',
        onPress: () => {
            props.Delete(props.index)
            
        },
    }

    return(
        <Swipeout right={[deleteBtn]} autoClose={true} close={true} onOpen={() => {}} onClose={() => {}}>
            <View style={{ marginTop: 5, borderWidth: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ borderWidth: 1, borderColor: 'yellow', width: '75%' }}>
                    {/* <Text>{}</Text> */}
                    <ProductView {...props.productInfo.product} />
                </View>
                <View style={{ borderWidth: 1, borderColor: 'red', width: '25%', paddingRight: 5, paddingLeft: 5, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text>Вес:</Text>
                    <TextInput
                        placeholder={'----'}
                        style={{ borderBottomWidth: 1 }}
                        value={textValue}
                        onChangeText={text => setTextValue(text)}
                        maxLength={4}
                        keyboardType={'numeric'}
                    />
                    <Text>г.</Text>
                </View>
            </View>
        </Swipeout>
    )
}

const ProductView = (product: IProduct) => {
    return (
        <View style={{ borderWidth: 1, padding: 5 }}>
                <Text style={{ fontSize: 16 }}>{product.Name}</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop:3}}>
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


const FoodRecordContainer = (props:any) => {
    return (<FoodRecord {...props}/>)
}


const mapStateToProps = (state:IApplicationState) => ({

})

export default connect(
    mapStateToProps, 
    {

        SetFood

    })(FoodRecordContainer);