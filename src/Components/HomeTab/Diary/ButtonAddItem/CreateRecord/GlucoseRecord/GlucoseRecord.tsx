import React from 'react'
import { StyleSheet, Text, TextInput, View } from 'react-native'
import { style } from './GlucoseRecordStyle'


const GlucoseRecord = () => {

    const [valueText, setValueText] = React.useState<string>('')

    const Change = (text: string) => {
        setValueText(text);
    }

    return (
        <View style={style.container}>
            <Text>Введите значение</Text>
            <View style={{ flexDirection: "row" }}>
                <TextInput
                    textAlign="right"
                    maxLength={3}
                    keyboardType="numeric"
                    textAlignVertical="top"
                    style={{ marginRight: 5 }}
                    placeholder="---"
                    onBlur={(e) => {
                        console.log(valueText);
                    }}
                    onChangeText={Change} />

                <Text>mg/dL</Text>
            </View>
        </View>
    )
}

export default GlucoseRecord;