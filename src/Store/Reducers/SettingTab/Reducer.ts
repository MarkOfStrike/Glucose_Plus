import { Reducer } from "react";
import { SET_NEW_MEASUREMENT } from "../../../constants/ActionsName";
import { GetValueStorage, SetValueStorage } from "../../../StorageWork";
import { SettingsAction } from "./Action";

export interface ISettingState {
    measurement: string,
    loading: {
        import:boolean,
        export:boolean
    }

}

const GetMeasurement = () => {

    let res = ''
    GetValueStorage('value_measuring').then(data => {
        if (!data) {
            SetValueStorage('value_measuring', 'mg/ml')
            res = 'mg/ml'
        } else { 
            res = data as string
        }

    }).catch(e => {
        return e
    })

    return res;
} 

const initState:ISettingState = {
    measurement: 'mg/ml',
    loading:{
        export:false,
        import:false
    }
}

export const SettingTabReducer:Reducer<ISettingState, SettingsAction> = (state = initState, action) => {

    switch (action.type) {
        case SET_NEW_MEASUREMENT:
            SetValueStorage('value_measuring', action.text)
            return {
                ...state,
                measurement: action.text
            }
    
        default:
            return state
    }

}