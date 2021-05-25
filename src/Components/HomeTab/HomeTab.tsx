import { createStackNavigator } from '@react-navigation/stack';
import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux';
import { IApplicationState } from '../../Store/StoreInterfaces';
import CreateRecord from './Diary/ButtonAddItem/CreateRecord/CreateRecord';
import Diary from './Diary/Diary';
import {SaveRecord} from '../../Store/Reducers/CreateRecord/Action'
import CustomButton from '../CustomElement/CustomButton';

const HomePageStack = createStackNavigator();

const HomeTab = (props:any) => {

    // console.log(props.newRecord);
    

    return(
        <HomePageStack.Navigator initialRouteName={'Diary'}>
            <HomePageStack.Screen
                name="Diary"
                component={Diary}
                options={{ headerTitle: "Дневник", headerShown: false }} />
                <HomePageStack.Screen
                name='AddRecord'
                component={CreateRecord}
                options={{
                    headerTitle: 'Добавление записи...',
                    headerShown: true, 
                    headerTitleContainerStyle:{
                        width:'65%', 
                        height:'100%',
                        justifyContent:'center',
                        alignItems:'flex-start',
                        alignContent:'center'
                    },
                    headerRightContainerStyle: {
                        width:"15%"
                    }}}/>
                <HomePageStack.Screen
                name='MoreDetailsOfRecord'
                component={EmptyComponent}
                options={{headerTitle:'Подробнее', headerShown:true}}/>
        </HomePageStack.Navigator>
    )
}

const SaveBtn = (props:any) => {

    if(!props.isExist){
        return null
    } else {
        return (
            <View>
                <Text>Сохранить ({props.count})</Text>
            </View>
        )
    }
    
}

const EmptyComponent = () => {
    return(<View></View>)
}

//Для того чтобы пробрасывать конект с пропсами
const HomeTabContainer = (props:any) => {

    return (<HomeTab {...props}/>)
}

//export default HomeTabContainer;

const mapStateToProps = (state:IApplicationState) => ({
    newRecord: state.CreateRecord.Record
})

export default connect(
    mapStateToProps,
    {
        SaveRecord
    })(HomeTabContainer)