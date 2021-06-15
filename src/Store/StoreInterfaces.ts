import { IDiaryState } from "../Interfaces/IDiary";
import { IAddProductState } from "./Reducers/AddProduct/Reducer";
import { ICreateRecordState } from "./Reducers/CreateRecord/Reducer";
import { IHomeScreenState } from "./Reducers/HomeScreen/Reducer";
import { IMoreDetailsOfRecordState } from "./Reducers/MoreDetailsOfRecord/Reducer";
import { ISettingState } from "./Reducers/SettingTab/Reducer";
import { IStatisticTabState } from "./Reducers/StatisticTab/Reducer";

export interface IApplicationState {
    Diary: IDiaryState
    AddProduct: IAddProductState
    CreateRecord: ICreateRecordState
    HomeScreen: IHomeScreenState
    StatisticTab: IStatisticTabState
    SettingTab: ISettingState
    MoreDetailsOfRecord: IMoreDetailsOfRecordState
}

export interface IApplicationAction<TAction> {
    (dispatch: (action: TAction) => void, getState: () => IApplicationState): void
}