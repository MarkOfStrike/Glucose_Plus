import React from 'react';
import { Text, View } from 'react-native';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';

import HomeTab from './Components/HomeTab/HomeTab';
import SettingTab from './Components/SettingTab/SettingTab';
import StatisticTab from './Components/StatisticTab/StatisticTab';
import { LoadSampleData } from './Store/Reducers/HomeScreen/Action';
import { IApplicationState } from './Store/StoreInterfaces';
import TabBarIcon from './TabBarIcon';
import { RootNavigationParamList } from './TabBarTypes';


const RootNavigation = createBottomTabNavigator<RootNavigationParamList>();

const NavigationApp = (props: any) => {

    return (
        <NavigationContainer >
            <RootNavigation.Navigator lazy={false}>
                <RootNavigation.Screen
                    name="Home"
                    component={HomeTab}
                    options={{
                        tabBarLabel: "Дневник",
                        tabBarIcon: ({ color }) => <TabBarIcon name="book-outline" color={color} />,
                        unmountOnBlur: true
                    }} />

                <RootNavigation.Screen
                    name="Statistic"
                    component={StatisticTab}
                    options={{
                        tabBarLabel: "Статистика",
                        tabBarIcon: ({ color }) => <TabBarIcon name="stats-chart-outline" color={color} />,
                        unmountOnBlur: true
                    }} />

                <RootNavigation.Screen
                    name="Setting"
                    component={SettingTab}
                    options={{
                        tabBarLabel: "Настройки",
                        tabBarIcon: ({ color }) => <TabBarIcon name="settings-outline" color={color} />,
                        unmountOnBlur:true
                    }} />
            </RootNavigation.Navigator>
        </NavigationContainer>
    )

}

const NavigationAppContainer = (props: any) => {

    React.useEffect(() => {
        props.LoadSampleData();
    }, [props.LoadSampleData])


    if (props.isLoading) {

        return (
            <View>
                <Text>ЗАГРУЗКА</Text>
            </View>
        )

    } else {

        return (
            <NavigationApp {...props} />
        )
    }
}

const mapStateToProps = (state: IApplicationState) => ({
    isLoading: state.HomeScreen.isLoading
})

export default compose(connect(
    mapStateToProps,
    {
        LoadSampleData
    }
))(NavigationAppContainer)




