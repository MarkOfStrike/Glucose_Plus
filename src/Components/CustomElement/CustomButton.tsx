import React, { FC } from 'react'
import { View, Text, StyleProp, ViewStyle } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'

interface ICustomButtonProps {
    onPress: () => void
    style?: StyleProp<ViewStyle>
    colorText?: string
    title: string | number
    fontSize?: number
}

const CustomButton: FC<ICustomButtonProps> = (props) => {

    const style = props.style ?? {
        backgroundColor: '#530FAD',
        alignSelf:'center',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        height: 40
    };

    return (
        <TouchableOpacity activeOpacity={0.8} onPress={props.onPress} style={style}>
            <Text style={{ 
                    color: props.colorText ?? 'black', 
                    fontSize: props.fontSize ?? 15 }}>
                    {props.title}
                </Text>
        </TouchableOpacity>
    )
}

export default CustomButton;