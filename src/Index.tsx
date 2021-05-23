import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react'
import HomeTab from './Components/HomeTab/HomeTab';
import SettingTab from './Components/SettingTab/SettingTab';
import StatisticTab from './Components/StatisticTab/StatisticTab';
import TabBarIcon from './TabBarIcon';
import { RootNavigationParamList } from './TabBarTypes';



const RootNavigation = createBottomTabNavigator<RootNavigationParamList>();


const NavigationApp = () => {

    return (
        <NavigationContainer >
            <RootNavigation.Navigator lazy={false}>
                <RootNavigation.Screen
                    name="Home"
                    component={HomeTab}
                    options={{
                        tabBarLabel: "Дневник",
                        tabBarIcon: ({ color }) => <TabBarIcon name="book-outline" color={color} />
                    }}/>

                <RootNavigation.Screen
                    name="Statistic"
                    component={StatisticTab}
                    options={{
                        tabBarLabel: "Статистика",
                        tabBarIcon: ({ color }) => <TabBarIcon name="stats-chart-outline" color={color} />
                    }} />

                <RootNavigation.Screen
                    name="Setting"
                    component={SettingTab}
                    options={{
                        tabBarLabel: "Настройки",
                        tabBarIcon: ({ color }) => <TabBarIcon name="settings-outline" color={color} />
                    }} />
            </RootNavigation.Navigator>
        </NavigationContainer>
    )

}


export default NavigationApp;



