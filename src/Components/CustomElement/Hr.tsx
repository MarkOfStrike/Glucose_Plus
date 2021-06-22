import React from 'react';
import { View } from 'react-native';

/**
 * Разделительная линия как <hr/> в html
 * 
 * @returns 
 */
const Hr = () => {
    return (
        <View
            style={{
                // padding: 2,
                borderBottomColor: "rgba(128,128,128, 0.2)",
                borderBottomWidth: 1,
            }}
        />
    )
}

export default Hr;