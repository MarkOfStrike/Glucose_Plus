import { Reducer } from "react";
import { CHECK_ADD_STATE, CLEAR_CREATE_RECORD, SET_CREATE_RECORD_DATE, SET_CREATE_RECORD_FOOD, SET_CREATE_RECORD_GLUCOSE } from "../../../constants/ActionsName";
import { IProduct } from "../../../DataBase/Models/Product";
import { CreateRecordActions } from "./Action";


export interface ICreateRecordState {
    Glucose: string 
    Food: ICreateFood | null
    DateCreate: string
    Record: ICreateRecord
}

export interface ICreateFood {
    name: string
    insulinLevel:string
    products: Array<IRecordProduct>
}

export interface IRecordProduct {
    product: IProduct
    weight: string
}

export interface ICreateRecord {
    isExist: boolean
    count: number
}

const initState:ICreateRecordState = {
    DateCreate: '',
    Food: null,
    Glucose: '',
    Record: {
        isExist: false,
        count: 0
    }
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

        case CHECK_ADD_STATE:
            return {
                ...state,
                Record: {
                    isExist: action.isState,
                    count: action.countRecord ?? 0
                }
            }
    
        default:
            return state
    }

}