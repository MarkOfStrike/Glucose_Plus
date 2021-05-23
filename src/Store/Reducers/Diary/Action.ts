import { FOOD_RECORD_TABLE } from '../../../DataBase/DataBaseConst';
import { IApplicationAction } from '../../StoreInterfaces';
import { GET_ALL_RECORDS_PRODUCT, GET_STATISTIC } from "../../../constants/ActionsName";
import { IRecord, IStatistic } from "../../../Interfaces/IDiary";
import DbContext from '../../../DataBase/DataBase';
import { IDictionary } from '../../../Interfaces/IDictionary';
import { Dictionary } from '../../../Classes/Dictionary';
import { IFood } from '../../../DataBase/Models/Food';
import { IProduct } from '../../../DataBase/Models/Product';

export interface GetAllRecord {
    type: typeof GET_ALL_RECORDS_PRODUCT
    records: IDictionary<Array<IRecord>>
    countRecord: number
}

export interface GetStatistic {
    type: typeof GET_STATISTIC
    statistic: IStatistic
}

export type DiaryPageType = GetAllRecord | GetStatistic



export const GetRecords = ():IApplicationAction<GetAllRecord> => (dispatch, getState) => {

    if(getState().Diary){

        const db = DbContext();
        
        const dic = new Dictionary<Array<IRecord>>();


        db.transaction(tr => {

            tr.executeSql(`select * from ${FOOD_RECORD_TABLE}`, [], (x, r) => {
                // console.log(r);
                
            })

        })
        
        let count = 0;

        for (const key in dic.getObject()) { count++; }

        dispatch({type: GET_ALL_RECORDS_PRODUCT, records: dic.getObject(), countRecord: count})
    }

}

