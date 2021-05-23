import { AddProductReducer } from "./Reducers/AddProduct/Reducer";
import { CreateRecordReducer } from "./Reducers/CreateRecord/Reducer";
import { DiaryPageReducer } from "./Reducers/Diary/Reducer";

export const Reducers = {
    Diary: DiaryPageReducer,
    AddProduct: AddProductReducer,
    CreateRecord: CreateRecordReducer,
}