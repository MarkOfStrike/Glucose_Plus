import {StyleSheet} from 'react-native';

export const style = StyleSheet.create({
    container: {
        //padding: 1,
        borderColor:"rgba(128,128,128, 0.1)",
        borderWidth: 1,
        padding: 10,
        marginTop: 10,
        marginBottom: 5,

        shadowOffset: {
            width: 0,
            height: -3,
          },
          shadowOpacity: 0.18,
          shadowRadius: 5.6,
          elevation: 1,
    },
    nameAndTimeContainer: {
        flex:1,
        // borderColor:'yellow',
        // borderWidth: 2,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    infoContainer: {
        flex: 1,
        // borderColor:'red',
        // borderWidth: 2,
        // alignSelf: 'center',
        // alignItems: 'center',
        alignContent:'space-between',
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 5,
    },
    info:{
        // width: "16.5%",
    },
    headerText: {
         margin: 5,
        // marginRight: 10,
        // marginTop: 8,
    }
});