import React from 'react';
import { Text, View } from 'react-native';

import CustomButton from '../../../CustomElement/CustomButton';
import { style } from './ButtonAddItemStyle';

const ButtonAddItem = (props: any) => {
    return (
        <View style={style.container}>
            <CustomButton
                style={style.buttonAdd}
                title="Добавить запись"
                onPress={() => {
                    props.Click();

                }}
            />
        </View>
    )
}

export default ButtonAddItem;