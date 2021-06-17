import { DELETE_RECORD, GET_INFO_RECORD } from '../../../constants/ActionsName';
import DbContext from '../../../DataBase/DataBase';
import {
    FOOD_RECORD_TABLE, FOOD_RECORD_TABLE_FOOD_ID, FOOD_RECORD_TABLE_NUMBERS_OF_GRAMS,
    FOOD_RECORD_TABLE_PRODUCT_ID, FOOD_TABLE, FOOD_TABLE_CARBOHYDRATE_RATIO, FOOD_TABLE_DATE_ADD,
    FOOD_TABLE_ID, FOOD_TABLE_INSULIN, FOOD_TABLE_NAME, GLUCOSE_MEASUREMENT_TABLE,
    GLUCOSE_MEASUREMENT_TABLE_DATE_ADD, GLUCOSE_MEASUREMENT_TABLE_ID,
    GLUCOSE_MEASUREMENT_TABLE_LEVEL, PRODUCTS_TABLE, PRODUCTS_TABLE_CALORIES,
    PRODUCTS_TABLE_CARBOHYDRATES, PRODUCTS_TABLE_FATS, PRODUCTS_TABLE_GI, PRODUCTS_TABLE_ID,
    PRODUCTS_TABLE_NAME, PRODUCTS_TABLE_PROTEINS, PRODUCTS_TABLE_XE
} from '../../../DataBase/DataBaseConst';
import { IGlucoseMeasurement } from '../../../DataBase/Models/GlucoseMeasurement';
import { IProduct } from '../../../DataBase/Models/Product';
import { IRecord, TypeRecord } from '../../../Interfaces/IDiary';
import { IApplicationAction } from '../../StoreInterfaces';
import { IMoreDetailsOfRecordState, IMRFood, IMRGlucose } from './Reducer';

interface GetInfoRecordAction {
    type: typeof GET_INFO_RECORD
    record: IMRGlucose | IMRFood
    typeRecord: TypeRecord
}

interface DeleteRecordAction {
    type: typeof DELETE_RECORD
}

export type MoreDetailsActions = GetInfoRecordAction | DeleteRecordAction

export const DeleteRecord = (id:number, type:TypeRecord):IApplicationAction<DeleteRecordAction> => (dispatch, getState) => {

    const db = DbContext();

    db.transaction(tr => {

        switch (type) {
            case TypeRecord.Glucose:

                tr.executeSql(`delete from ${GLUCOSE_MEASUREMENT_TABLE} where ${GLUCOSE_MEASUREMENT_TABLE_ID} = ${id}`)

                break;
            case TypeRecord.Product:

                tr.executeSql(`delete from ${FOOD_TABLE} where ${FOOD_TABLE_ID} = ${id}`)

                break;

            default:
                break;
        }
    },error => {
        console.log(error);
    }, () => {
        dispatch({type:DELETE_RECORD});
    })


}

export const GetInfo = (id:number, type:TypeRecord):IApplicationAction<GetInfoRecordAction> => (dispatch, getState) => {

    // console.log(id, type);
    

    let record: IMRGlucose | IMRFood = {
        date:'',
        level: 0
    }


    const db = DbContext()

    db.transaction(tr => {

        if (type === TypeRecord.Glucose) {
            
            tr.executeSql(`select * from ${GLUCOSE_MEASUREMENT_TABLE} where ${GLUCOSE_MEASUREMENT_TABLE_ID} = ${id}`, [], (t,r) => {

                const el = r.rows.item(0);

                const res:IMRGlucose = {
                    date: new Date(el[GLUCOSE_MEASUREMENT_TABLE_DATE_ADD] as number).toString(),
                    level: el[GLUCOSE_MEASUREMENT_TABLE_LEVEL] as number
                }

                record = res;

            })

        } else if (type === TypeRecord.Product){

            // const query = 'select f.Id, sum(p.Id) from Foods f join FoodRecords fr on fr.Food_Id = f.Id join Products p on p.Id = fr.Product_Id where f.Id = 2'

            const sum = `sum(fr.${FOOD_RECORD_TABLE_NUMBERS_OF_GRAMS}) as ${FOOD_RECORD_TABLE_NUMBERS_OF_GRAMS}, sum(${PRODUCTS_TABLE_CALORIES}) as ${PRODUCTS_TABLE_CALORIES}, sum(${PRODUCTS_TABLE_CARBOHYDRATES}) as ${PRODUCTS_TABLE_CARBOHYDRATES}, sum(${PRODUCTS_TABLE_FATS}) as ${PRODUCTS_TABLE_FATS}, sum(${PRODUCTS_TABLE_GI}) as ${PRODUCTS_TABLE_GI}, sum(${PRODUCTS_TABLE_PROTEINS}) as ${PRODUCTS_TABLE_PROTEINS}, sum(${PRODUCTS_TABLE_XE}) as ${PRODUCTS_TABLE_XE} `
            const select = `select f.${FOOD_TABLE_NAME} as ${FOOD_TABLE_NAME}, f.${FOOD_TABLE_DATE_ADD} as ${FOOD_TABLE_DATE_ADD}, f.${FOOD_TABLE_CARBOHYDRATE_RATIO} as ${FOOD_TABLE_CARBOHYDRATE_RATIO}, f.${FOOD_TABLE_INSULIN} as ${FOOD_TABLE_INSULIN}, ${sum} `
            const from = `from ${FOOD_TABLE} f join ${FOOD_RECORD_TABLE} fr on fr.${FOOD_RECORD_TABLE_FOOD_ID} = f.${FOOD_TABLE_ID} join ${PRODUCTS_TABLE} p on p.${PRODUCTS_TABLE_ID} = fr.${FOOD_RECORD_TABLE_PRODUCT_ID} `
            const where = `where f.${FOOD_TABLE_ID} = ${id}`

            

            const query = select + from + where


            tr.executeSql(query, [], (t,r) => {

                const el = r.rows.item(0);

                const result:IMRFood = {
                    date: el[FOOD_TABLE_DATE_ADD] as number,
                    insulin: el[FOOD_TABLE_INSULIN] as number,
                    name: el[FOOD_TABLE_NAME] as string,
                    yk: el[FOOD_TABLE_CARBOHYDRATE_RATIO] as number,
                    sumValue:{
                        Calories: el[PRODUCTS_TABLE_CALORIES] as number,
                        Carbohydrates: el[PRODUCTS_TABLE_CARBOHYDRATES] as number,
                        Fats: el[PRODUCTS_TABLE_FATS] as number,
                        Gi: el[PRODUCTS_TABLE_GI] as number,
                        Proteins: el[PRODUCTS_TABLE_PROTEINS] as number,
                        Xe: el[PRODUCTS_TABLE_XE] as number
                    },
                    weight: el[FOOD_RECORD_TABLE_NUMBERS_OF_GRAMS] as number,
                    products: []

                }

                const q = `select * from ${FOOD_RECORD_TABLE} fr join ${PRODUCTS_TABLE} p on p.${PRODUCTS_TABLE_ID} = fr.${FOOD_RECORD_TABLE_PRODUCT_ID} where fr.${FOOD_RECORD_TABLE_FOOD_ID} = ${id}`;
                t.executeSql(q, [], (n,res) => {

                    for (let index = 0; index < res.rows.length; index++) {
                        const prod = res.rows.item(index);

                        result.products.push({
                            product:{
                                Name: prod[PRODUCTS_TABLE_NAME] as string,
                                Calories: prod[PRODUCTS_TABLE_CALORIES] as number,
                                Carbohydrates: prod[PRODUCTS_TABLE_CARBOHYDRATES] as number,
                                Fats: prod[PRODUCTS_TABLE_FATS] as number,
                                Gi: prod[PRODUCTS_TABLE_GI] as number,
                                Proteins: prod[PRODUCTS_TABLE_PROTEINS] as number,
                                Xe: prod[PRODUCTS_TABLE_XE] as number
                            },
                            weight: prod[FOOD_RECORD_TABLE_NUMBERS_OF_GRAMS]
                        })          

                    }
                })

                record = result;

            })


        }


    }, error => {
        console.log(error);
    }, () => {
        dispatch({type:GET_INFO_RECORD, record: record, typeRecord: type})
    })

}
