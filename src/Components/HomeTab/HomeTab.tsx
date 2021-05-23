import { createStackNavigator } from '@react-navigation/stack';
import React from 'react'
import { Text, View } from 'react-native'
import CreateRecord from './Diary/ButtonAddItem/CreateRecord/CreateRecord';
import Diary from './Diary/Diary';

const HomePageStack = createStackNavigator();

const HomeTab = () => {
    return(
        <HomePageStack.Navigator initialRouteName={'Diary'}>
            <HomePageStack.Screen
                name="Diary"
                component={Diary}
                options={{ headerTitle: "Дневник", headerShown: false }} />
                <HomePageStack.Screen
                name='AddRecord'
                component={CreateRecord}
                options={{headerTitle: 'Добавление записи...', headerShown: true, headerRight: () => {
                    return(
                        <View>
                            <Text>Сохранить {true? '(1)' : ''}</Text>
                        </View>
                    )
                }}}/>
                <HomePageStack.Screen
                name='MoreDetailsOfRecord'
                component={EmptyComponent}
                options={{headerTitle:'Подробнее', headerShown:true}}/>
        </HomePageStack.Navigator>
    )
}

const EmptyComponent = () => {
    return(<View></View>)
}

export default HomeTab;