import { Reducer } from "react";
import { GET_ALL_RECORDS_PRODUCT, GET_STATISTIC } from "../../../constants/ActionsName";
import { IDiaryState } from "../../../Interfaces/IDiary";
import { DiaryPageType } from "./Action";


const initState: IDiaryState = {
    Records: null,
    Statistic: {
        Glucose: {
            Avg: 0,
            Min: 0,
            Max: 0
        },
        Product: {
            Gi: 0,
            Xe: 0,
            Fats: 0,
            Proteins: 0,
            Carbohydrates: 0,
        }
    }
}

export const DiaryPageReducer: Reducer<IDiaryState, DiaryPageType> = (state = initState, action): IDiaryState => {

    switch (action.type) {
        case GET_ALL_RECORDS_PRODUCT:
            return {
                ...state,
                Records: action.countRecord > 0 ? action.records : null
            }
        case GET_STATISTIC:
            return {
                ...state,
                Statistic: action.statistic
            }

        default:
            return state
    }

}