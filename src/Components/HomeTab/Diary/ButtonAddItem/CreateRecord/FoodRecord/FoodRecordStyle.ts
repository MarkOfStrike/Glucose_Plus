import { StyleSheet } from 'react-native';

export const style = StyleSheet.create({
    container: {
        // flex:3,
        // marginRight: 10,
        // marginLeft: 10,
        // marginTop: 24,
        height:'100%', 
        // borderWidth: 1, 
        // borderColor: 'red',

    },
    addBtnProduct: {
        borderRadius: 10,
        backgroundColor: '#689E57',
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 35,
        paddingRight: 35,
    },
    infoProduct: {
        // borderWidth: 1, 
        // borderColor: 'yellow', 
        width: '75%',
        // borderBottomLeftRadius: 20,

    },
    inputProduct: {
        // borderWidth: 1, 
        // borderColor: 'red', 
        width: '25%', 
        paddingRight: 5, 
        paddingLeft: 5, 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        // borderBottomRightRadius: 20
    }
})