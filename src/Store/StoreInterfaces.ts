import { IDiaryState } from "../Interfaces/IDiary";
import { IAddProductState } from "./Reducers/AddProduct/Reducer";
import { ICreateRecordState } from "./Reducers/CreateRecord/Reducer";
import { IHomeScreenState } from "./Reducers/HomeScreen/Reducer";

export interface IApplicationState {
    Diary: IDiaryState
    AddProduct: IAddProductState
    CreateRecord: ICreateRecordState
    HomeScreen: IHomeScreenState
}

export interface IApplicationAction<TAction> {
    (dispatch: (action: TAction) => void, getState: () => IApplicationState): void
}