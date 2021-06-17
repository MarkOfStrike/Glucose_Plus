// import { IProduct } from "../../../DataBase/Models/Product";
import { Reducer } from 'redux';

import { GET_INFO_RECORD } from '../../../constants/ActionsName';
import { IGlucoseMeasurement } from '../../../DataBase/Models/GlucoseMeasurement';
import { IProduct } from '../../../DataBase/Models/Product';
import { TypeRecord } from '../../../Interfaces/IDiary';
import { MoreDetailsActions } from './Action';

export interface IMRFood {
    name: string
    date: number
    insulin: number
    yk: number
    weight: number
    sumValue: IProduct
    products: Array<{ product: IProduct, weight: number }>
}

export interface IMRGlucose {
    date: string
    level: number
}

export interface IMoreDetailsOfRecordState {
    info: IMRFood | IMRGlucose | null
    typeRecord: TypeRecord
}


const initState: IMoreDetailsOfRecordState = {
    info: null,
    typeRecord: TypeRecord.Glucose
}

export const MoreDetailsOfRecordReducer: Reducer<IMoreDetailsOfRecordState, MoreDetailsActions> = (state = initState, action) => {

    switch (action.type) {
        case GET_INFO_RECORD:
            return {
                info: action.record,
                typeRecord: action.typeRecord
            }
        default:
            return state;
    }


}