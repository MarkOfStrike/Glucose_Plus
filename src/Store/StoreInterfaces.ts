import { IDiaryState } from "../Interfaces/IDiary";
import { IAddProductState } from "./Reducers/AddProduct/Reducer";
import { ICreateRecordState } from "./Reducers/CreateRecord/Reducer";

export interface IApplicationState {
    Diary: IDiaryState
    AddProduct: IAddProductState
    CreateRecord: ICreateRecordState
}

export interface IApplicationAction<TAction> {
    (dispatch: (action: TAction) => void, getState: () => IApplicationState): void
}