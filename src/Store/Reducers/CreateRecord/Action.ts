import { FOOD_RECORD_TABLE, FOOD_TABLE, FOOD_TABLE_DATE_ADD, FOOD_TABLE_NAME, FOOD_RECORD_TABLE_FOOD_ID, FOOD_RECORD_TABLE_PRODUCT_ID, FOOD_RECORD_TABLE_NUMBERS_OF_GRAMS, GLUCOSE_MEASUREMENT_TABLE, GLUCOSE_MEASUREMENT_TABLE_LEVEL, GLUCOSE_MEASUREMENT_TABLE_DATE_ADD } from './../../../DataBase/DataBaseConst';
import { IApplicationAction } from './../../StoreInterfaces';
import { CHECK_ADD_STATE, CLEAR_CREATE_RECORD, SET_CREATE_RECORD_DATE, SET_CREATE_RECORD_FOOD, SET_CREATE_RECORD_GLUCOSE } from "../../../constants/ActionsName";
import { ICreateFood } from "./Reducer";
import DbContext from '../../../DataBase/DataBase';


export interface ClearCreateStateAction {
    type: typeof CLEAR_CREATE_RECORD
    action: null
}

export interface SetDateAction {
    type: typeof SET_CREATE_RECORD_DATE
    date: string
}

export interface SetFoodAction {
    type: typeof SET_CREATE_RECORD_FOOD
    food: ICreateFood
}

export interface SetGlucoseAction {
    type: typeof SET_CREATE_RECORD_GLUCOSE
    value: string
}

export interface CheckStateAction {
    type: typeof CHECK_ADD_STATE
    isState: boolean
    countRecord: number | null
}


type ClearAction = ClearCreateStateAction;
type SetStateAction = SetDateAction|SetFoodAction|SetGlucoseAction;
type CheckAction = CheckStateAction

export type CreateRecordActions = ClearAction | SetStateAction | CheckAction


export const ClearRecord = ():IApplicationAction<ClearAction> => (dispatch, getState) => { dispatch({type:CLEAR_CREATE_RECORD, action: null}); }

export const CheckState = ():IApplicationAction<CheckAction> => (dispatch, getState) => {

    const state = getState();

    if(state.CreateRecord) {

        const createRecordState = state.CreateRecord

        let countRecord:number = 0;
        let isState:boolean = false

        if (createRecordState.Food && createRecordState.Food.name !== '' && createRecordState.Food.products.length > 0) {
            countRecord++
        }

        if(createRecordState.Glucose && createRecordState.Glucose !== ''){
            countRecord++
        }

        if(countRecord !== 0) {
            isState = true;
        }

        dispatch({type: CHECK_ADD_STATE, countRecord: isState ? countRecord : null, isState});

    }


}

export const SetDate = (date: Date):IApplicationAction<SetStateAction> => SetAndCheck({type: SET_CREATE_RECORD_DATE, date: date.toString()});
export const SetGlucose = (level:string):IApplicationAction<SetStateAction> => SetAndCheck({type: SET_CREATE_RECORD_GLUCOSE, value: level});
export const SetFood = (food: ICreateFood):IApplicationAction<SetStateAction> => SetAndCheck({type:SET_CREATE_RECORD_FOOD, food});

const SetAndCheck = (state: SetStateAction):IApplicationAction<any> => (dispatch, getState) => {

    const stateApp = getState();

    if(stateApp.CreateRecord){

        Promise.all([dispatch(state), dispatch(CheckState())])

    }

}

export const SaveRecord = ():IApplicationAction<ClearAction> => (dispatch, getState) => {

    const state = getState().CreateRecord;
    const db = DbContext();

    db.transaction(tr => {

        const date = state.DateCreate === '' ? new Date(Date.now()).toString() : state.DateCreate;

        if (state.Food && state.Food.name !== '' && state.Food.products.length > 0) {
            tr.executeSql(`insert into ${FOOD_TABLE} (${FOOD_TABLE_NAME}, ${FOOD_TABLE_DATE_ADD}) values (\'${state.Food?.name}\',\'${Date.parse(date)}\')`, [], (nt, r) => {

                const foodId = r.insertId;
    
                state.Food?.products.map((product, i) => {
                    nt.executeSql(`insert into ${FOOD_RECORD_TABLE} (${FOOD_RECORD_TABLE_FOOD_ID}, ${FOOD_RECORD_TABLE_PRODUCT_ID}, ${FOOD_RECORD_TABLE_NUMBERS_OF_GRAMS}) values (${foodId}, ${product.product.Id}, ${parseInt(product.weight)})`,[])
                })
            })
        }

        if (state.Glucose !== '') {
            tr.executeSql(`insert into ${GLUCOSE_MEASUREMENT_TABLE} (${GLUCOSE_MEASUREMENT_TABLE_LEVEL}, ${GLUCOSE_MEASUREMENT_TABLE_DATE_ADD}) values (${parseFloat(state.Glucose)}, \'${Date.parse(date)}\') `, [])
        }
        
    }, error => {
        console.log(error)
    }, () => {
        dispatch({type:CLEAR_CREATE_RECORD, action: null});
    })
}