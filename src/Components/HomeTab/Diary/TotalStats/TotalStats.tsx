import React, { useState } from 'react'
import { Dimensions, ScrollView, StyleProp, Text, View, ViewStyle } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { SafeAreaView } from 'react-native-safe-area-context'
import Carousel from 'react-native-snap-carousel'
import { style } from './TotalStatsStyle'

interface IData {
    component: Array<JSX.Element>
}

const TotalStats = (props: any) => {

    const width = Dimensions.get('window').width;

    const [horizontal, setHorizontal] = useState<boolean>(false)

    const renderItem = (item: any) => {
        return (
            <View style={{
                backgroundColor: 'floralwhite',
                borderRadius: 15,
                padding: 15,
                margin: 20,
            }}>
                {item.item}
            </View>
        )
    }

    const components = [
        <LevelGlucose key={0} {...props.Glucose} />,
        <OtherStats key={1} {...props.Product} />
    ]

    return (
        <TouchableOpacity activeOpacity={0.8} style={{ flexDirection: 'row', justifyContent: 'center' }} onPress={() => setHorizontal(!horizontal)}>

            {horizontal ?
                <Carousel
                    layout={'default'}
                    sliderWidth={width}
                    itemWidth={width}
                    data={components}
                    autoplayDelay={5000}
                    autoplayInterval={5000}
                    autoplay={true}
                    loop={true}
                    renderItem={renderItem} />

                :

                <View style={style.container}>
                    {components.map((item, i) => {
                        return item;
                    })}
                </View>}

        </TouchableOpacity>

    )
}

//  const TestCarousel = () => {

//     const width = Dimensions.get('window').width;

//      return(
//         <View style={{ flexDirection:'row', justifyContent: 'center', alignItems: 'center', alignContent:'center', alignSelf: 'center'}}>
//         <Carousel 
//     layout={'default'}
//     sliderWidth={width}
//     itemWidth={width}
//     data={[<LevelGlucose key={0}/>, <OtherStats key={1}/>]} 
//     autoplayDelay={5000}
//     autoplayInterval={5000}
//     autoplay={true}
//     loop={true}

//     renderItem={(item:any) => {return(
//         <View style={{
//             backgroundColor:'floralwhite',
//             borderRadius: 15,
//             // height: 250,
//             padding: 15,
//             margin: 20,
//             // marginLeft: 30,
//             // marginRight: 30, 
//         }}>
//           {item.item}
//         </View>
//     )}}/>
//         </View>
//      )
//  }

const statsStyle: StyleProp<ViewStyle> = {
    borderStyle: 'solid',
    borderWidth: 2,
    borderColor: 'black',
    margin: 2,
    alignItems: 'flex-start',

}

const ConvertString = (value: number): string => value > 0 ? value.toFixed(2) : '---';

const LevelGlucose = (props: any) => {

    return (
        <View style={statsStyle}>
            <Text>Уровень глюкозы:</Text>
            <Text>Средний: {ConvertString(props.Avg)}</Text>
            <Text>Мин: {ConvertString(props.Min)}</Text>
            <Text>Макс: {ConvertString(props.Max)}</Text>
        </View>
    )
}

const OtherStats = (props: any) => {

    return (
        <View style={statsStyle}>
            <Text>Средние показатели:</Text>
            <Text>Инс: {ConvertString(props.InsLevel)}</Text>
            <Text>ХЕ: {ConvertString(props.Xe)}</Text>
            <Text>Угл: {ConvertString(props.Carbohydrates)}</Text>
            <Text>УК: {ConvertString(props.CarbohydrateRatio)}</Text>
        </View>
    )
}

export default TotalStats;