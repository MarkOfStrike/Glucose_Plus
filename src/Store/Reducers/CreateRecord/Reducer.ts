import { Reducer } from "react";
import { CLEAR_CREATE_RECORD, SET_CREATE_RECORD_DATE, SET_CREATE_RECORD_FOOD, SET_CREATE_RECORD_GLUCOSE } from "../../../constants/ActionsName";
import { IProduct } from "../../../DataBase/Models/Product";
import { CreateRecordActions } from "./Action";


export interface ICreateRecordState {
    Glucose: number | null
    Food: ICreateFood | null
    DateCreate: Date | null
}

export interface ICreateFood {
    name: string
    products: Array<IProduct>
}

const initState:ICreateRecordState = {
    DateCreate: null,
    Food: null,
    Glucose: null
}

export const CreateRecordReducer: Reducer<ICreateRecordState, CreateRecordActions> = (state = initState, action):ICreateRecordState => {

    switch (action.type) {

        case CLEAR_CREATE_RECORD:
            return {
                ...initState
            }
        
        case SET_CREATE_RECORD_GLUCOSE:
            return {
                ...state,
                Glucose: action.value
            }
        
        case SET_CREATE_RECORD_DATE:
            return {
                ...state,
                DateCreate: action.date
            }

        case SET_CREATE_RECORD_FOOD:
            return {
                ...state,
                Food: action.food
            }
    
        default:
            return state
    }

}