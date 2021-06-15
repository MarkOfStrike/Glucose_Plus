import React from 'react';
import { AppState, AppStateStatus, ScrollView, Text, View } from 'react-native';
import { connect, MapDispatchToProps, MapStateToProps } from 'react-redux';
import { compose } from 'redux';
import { GetAllRecord, GetRecords, GetStatistic } from '../../../Store/Reducers/Diary/Action';
import { IApplicationAction, IApplicationState } from '../../../Store/StoreInterfaces';
import Hr from '../../CustomElement/Hr';
import ButtonAddItem from './ButtonAddItem/ButtonAddItem';
import { style } from './DiaryStyle';
import Records from './Records/Records';
import TotalStats from './TotalStats/TotalStats';

const Container = (props: any) => {

    return <Diary {...props} />

}

const Diary = (props: any) => {

    const appState = React.useRef(AppState.currentState);

    const [appStateVisible, setAppStateVisible] = React.useState(
        appState.current
    );

    React.useEffect(() => {
        AppState.addEventListener("change", _handleAppStateChange);

        return () => {
            AppState.removeEventListener("change", _handleAppStateChange);
        };
    }, []);

    

    React.useEffect(() => {

        props.GetStatistic()
        props.GetRecords()

    }, [props.GetRecords, props.GetStatistic])

    const _handleAppStateChange = (nextAppState: AppStateStatus) => {
        if (
            appState.current.match(/inactive|background/) &&
            nextAppState === "active"
        ) {
            console.log("App has come to the foreground!");
        }

        appState.current = nextAppState;
        setAppStateVisible(appState.current);
        console.log("AppState", appState.current);
    };

    return (
        <View style={style.container}>

            <TotalStats {...props.Statistic} />

            <Hr />

            <ButtonAddItem
                Click={() => {
                    props.navigation.navigate("AddRecord", {});
                }}
            />

            <Hr />

            <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false} >

                <Records Records={props.Records} Navigate={props.navigation.navigate} />

            </ScrollView>
        </View>
    );
};

const mapStateToProps = (state: IApplicationState) => ({
    Records: state.Diary.Records,
    Statistic: state.Diary.Statistic
})

// interface IMapStateToAction {
//     GetRecords: () => IApplicationAction<GetAllRecord>
// }

// interface ITestProps {
//     test:number
// }

// interface IOwnTest {
//     parent: number
// }

// const asds: MapStateToProps<ITestProps, IOwnTest, IApplicationState> = (state, own) => ({
//     test: own.parent
// })



// const sasd: MapDispatchToProps<IMapStateToAction, IOwnTest> = () => ({
//     GetRecords
// })

// export default connect(
//     mapStateToProps,
//     mapStateToAction
// )(Diary);

export default connect(
    mapStateToProps,
    {
        GetRecords,
        GetStatistic
    }
)(Container);

