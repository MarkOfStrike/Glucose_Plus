import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { connect } from 'react-redux';

import { SetGlucose } from '../../../../../../Store/Reducers/CreateRecord/Action';
import { IApplicationState } from '../../../../../../Store/StoreInterfaces';
import { style } from './GlucoseRecordStyle';

const GlucoseRecord = (props:any) => {

    // console.log(props);
    

    const [valueText, setValueText] = React.useState<string>(props.levelGlucose)

    React.useEffect(() => {
        props.SetGlucose(valueText)
    },[valueText])

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
                        // console.log(valueText);
                    }}
                    onChangeText={Change}
                    value={valueText} />

                <Text>mg/dL</Text>
            </View>
        </View>
    )
}

const GlucoseRecordContainer = (props:any) => {
    return(<GlucoseRecord {...props}/>)
}

// export default GlucoseRecord;

export default connect(
    (state:IApplicationState) => ({
        levelGlucose: state.CreateRecord.Glucose
     }),
    {

        SetGlucose

    })(GlucoseRecordContainer)