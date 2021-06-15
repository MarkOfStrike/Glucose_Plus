import { AddProductReducer } from "./Reducers/AddProduct/Reducer";
import { CreateRecordReducer } from "./Reducers/CreateRecord/Reducer";
import { DiaryPageReducer } from "./Reducers/Diary/Reducer";
import { HomeScreenReducer } from "./Reducers/HomeScreen/Reducer";
import { MoreDetailsOfRecordReducer } from "./Reducers/MoreDetailsOfRecord/Reducer";
import { SettingTabReducer } from "./Reducers/SettingTab/Reducer";
import { StatisticTabReducer } from "./Reducers/StatisticTab/Reducer";

export const Reducers = {
    Diary: DiaryPageReducer,
    AddProduct: AddProductReducer,
    CreateRecord: CreateRecordReducer,
    HomeScreen: HomeScreenReducer,
    StatisticTab: StatisticTabReducer,
    SettingTab: SettingTabReducer,
    MoreDetailsOfRecord: MoreDetailsOfRecordReducer
}