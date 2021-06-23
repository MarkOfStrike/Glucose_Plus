import { Reducer } from 'react';

import {
    SET_NEW_MEASUREMENT, SHOW_EXPORT_MESSAGE, SHOW_IMPORT_MESSAGE
} from '../../../constants/ActionsName';
import { GetValueStorage, SetValueStorage } from '../../../StorageWork';
import { SettingsAction } from './Action';

export interface ISettingState {
    measurement: string,
    loading: {
        import: boolean,
        export: boolean
    }
    importToast: IShowMessage
    exportToast: IShowMessage

}

export interface IShowMessage {

    show: boolean
    message: string

}

const GetMeasurement = () => {

    let res = ''
    GetValueStorage('value_measuring').then(data => {
        if (!data) {
            SetValueStorage('value_measuring', 'mg/dL')
            res = 'mg/dL'
        } else {
            res = data as string
        }

    }).catch(e => {
        return e
    })

    return res;
}

const initState: ISettingState = {
    measurement: 'mg/dL',
    loading: {
        export: false,
        import: false
    },
    importToast: {
        show: false,
        message: ''
    },
    exportToast: {
        show: false,
        message: ''
    }
}

export const SettingTabReducer: Reducer<ISettingState, SettingsAction> = (state = initState, action) => {

    switch (action.type) {
        case SET_NEW_MEASUREMENT:
            SetValueStorage('value_measuring', action.text)
            return {
                ...state,
                measurement: action.text
            }
        case SHOW_IMPORT_MESSAGE:
            return {
                ...state,
                importToast: {
                    show: action.show,
                    message: action.message
                }
            }
        case SHOW_EXPORT_MESSAGE:
            return {
                ...state,
                exportToast: {
                    show: action.show,
                    message: action.message
                }
            }

        default:
            return state
    }

}