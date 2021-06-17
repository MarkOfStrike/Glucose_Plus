import React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';

import { createStackNavigator } from '@react-navigation/stack';

import { TypeRecord } from '../../Interfaces/IDiary';
import { SaveRecord } from '../../Store/Reducers/CreateRecord/Action';
import { IApplicationState } from '../../Store/StoreInterfaces';
import { HomeNavigationParamsList } from '../../TabBarTypes';
import CreateRecord from './Diary/ButtonAddItem/CreateRecord/CreateRecord';
import Diary from './Diary/Diary';
import MoreDetailsOfRecord from './MoreDetailsOfRecord/MoreDetailsOfRecord';

const HomePageStack = createStackNavigator<HomeNavigationParamsList>();

const HomeTab = (props: any) => {


    return (
        <HomePageStack.Navigator initialRouteName={'Diary'}>
            <HomePageStack.Screen
                name="Diary"
                component={Diary}
                options={{ headerTitle: "Дневник", headerShown: false, }} />
            <HomePageStack.Screen
                name='AddRecord'
                component={CreateRecord}
                options={{
                    headerTitle: 'Добавление записи...',
                    headerShown: true,
                    headerTitleContainerStyle: {
                        width: '65%',
                        height: '100%',
                        justifyContent: 'center',
                        alignItems: 'flex-start',
                        alignContent: 'center'
                    },
                    headerRightContainerStyle: {
                        width: "15%"
                    }
                }} />
            <HomePageStack.Screen
                name='MoreDetailsOfRecord'
                component={MoreDetailsOfRecord}
                options={{ headerTitle: 'Подробнее', headerShown: true }}
                initialParams={{ id: 0, type: TypeRecord.Glucose }} />
        </HomePageStack.Navigator>
    )
}

const EmptyComponent = () => {
    return (<View></View>)
}

const HomeTabContainer = (props: any) => {

    return (<HomeTab {...props} />)
}


const mapStateToProps = (state: IApplicationState) => ({
    newRecord: state.CreateRecord.Record
})

export default connect(
    mapStateToProps,
    {
        SaveRecord
    })(HomeTabContainer)