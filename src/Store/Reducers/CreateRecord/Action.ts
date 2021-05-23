import { IApplicationAction } from './../../StoreInterfaces';
import { CLEAR_CREATE_RECORD, SET_CREATE_RECORD_DATE, SET_CREATE_RECORD_FOOD, SET_CREATE_RECORD_GLUCOSE } from "../../../constants/ActionsName";
import { ICreateFood } from "./Reducer";


export interface ClearCreateStateAction {
    type: typeof CLEAR_CREATE_RECORD
    action: null
}

export interface SetDateAction {
    type: typeof SET_CREATE_RECORD_DATE
    date: Date
}

export interface SetFoodAction {
    type: typeof SET_CREATE_RECORD_FOOD
    food: ICreateFood
}

export interface SetGlucoseAction {
    type: typeof SET_CREATE_RECORD_GLUCOSE
    value: number
}

type ClearAction = ClearCreateStateAction;
type SetStateAction = SetDateAction|SetFoodAction|SetGlucoseAction;

export type CreateRecordActions = ClearAction | SetStateAction


export const SetDate = (date: Date):IApplicationAction<SetDateAction> => (dispatch, getState) => {

    dispatch({type: SET_CREATE_RECORD_DATE, date});

}

export const SetGlucose = (level:number):IApplicationAction<SetGlucoseAction> => (dispatch, getState) => {

    dispatch({type: SET_CREATE_RECORD_GLUCOSE, value: level});

}

export const SetFood = (food: ICreateFood):IApplicationAction<SetFoodAction> => (dispatch, getState) => {

    dispatch({type:SET_CREATE_RECORD_FOOD, food});

}

export const ClearRecord = ():IApplicationAction<ClearCreateStateAction> => (dispatch, getState) => {

    dispatch({type:CLEAR_CREATE_RECORD, action: null});

}