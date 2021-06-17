import { StyleSheet } from 'react-native';

const style = StyleSheet.create({
    container: {
        // flex:1,
        height: '100%',
        borderWidth: 5,
    },
    btnContainer: {
        alignSelf:"center",
        alignContent:'center',
        flexDirection:'row',
        justifyContent: 'space-between',
        width: '50%',
        margin: 10
    },
    btnView:{
        alignSelf:'center',
        backgroundColor: '#2f674a', 
        alignItems: 'center',
        flexDirection:'column',
        justifyContent: 'center',
        width: 60, 
        height:60, 
        borderRadius:50, 
        borderWidth: 2, 
        borderColor: 'black',
        
    },
    timeContainer: {
        backgroundColor: 'red', 
        borderRadius: 50, 
        margin: 10, 
        height: 40, 
        flexDirection: 'row', 
        justifyContent: 'space-between'
    },
    timeContainer_info_container: {
        flex:1, 
        flexDirection: 'row', 
        alignSelf: 'center', 
        justifyContent: 'space-between', 
        borderColor: 'black', 
        borderWidth: 2, 
        height: '100%'
    },
    timeContainer_info_name: {
        marginLeft: 15, 
        textAlignVertical: 'center'
    },
    timeContainer_info_time: {
        textAlign: 'right', 
        textAlignVertical: 'center', 
        fontSize: 12, 
        borderColor: 'yellow', 
        borderWidth: 2, 
        flexWrap: 'wrap',
        width: "60%",
        paddingRight: 5
    },
    timeContainer_btn: {
        width: 33, 
        height: 33, 
        borderRadius: 50, 
        backgroundColor: 'grey', 
        alignSelf: 'flex-end', 
        margin: 4, 
        borderWidth: 2, 
        borderColor: 'black'
    }
    
})

export default style;