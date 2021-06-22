import React, { useState } from 'react';
import { Dimensions, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Carousel from 'react-native-snap-carousel';
import LevelGlucose from './LevelGlucose/LevelGlucose';
import OtherStats from './OtherStats/OtherStats';
import { style } from './TotalStatsStyle';

interface IData {
    component: Array<JSX.Element>
}

const TotalStats = (props: any) => {

    const width = Dimensions.get('window').width;

    const [horizontal, setHorizontal] = useState<boolean>(false)

    const renderItem = (item: any) => {
        return (
            <View style={[style.render_container, style.carusel_align]}>
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
                    renderItem={renderItem}/>

                :

                <View style={[style.container, style.render_container]}>
                    {components.map((item, i) => {
                        return item;
                    })}
                </View>}

        </TouchableOpacity>

    )
}




export default TotalStats;