import { IGlucoseMeasurement } from './../../../DataBase/Models/GlucoseMeasurement';
import { FOOD_TABLE, FOOD_TABLE_DATE_ADD, GLUCOSE_MEASUREMENT_TABLE, GLUCOSE_MEASUREMENT_TABLE_DATE_ADD, FOOD_TABLE_ID, FOOD_RECORD_TABLE_PRODUCT_ID, FOOD_RECORD_TABLE_NUMBERS_OF_GRAMS, FOOD_RECORD_TABLE_FOOD_ID, PRODUCTS_TABLE, PRODUCTS_TABLE_ID } from './../../../DataBase/DataBaseConst';
import { FOOD_RECORD_TABLE } from '../../../DataBase/DataBaseConst';
import { IApplicationAction } from '../../StoreInterfaces';
import { GET_ALL_RECORDS_PRODUCT, GET_STATISTIC } from "../../../constants/ActionsName";
import { IDataProduct, IDiaryRecord, IRecord, IStatistic, TypeRecord } from "../../../Interfaces/IDiary";
import DbContext from '../../../DataBase/DataBase';
import { IDictionary } from '../../../Interfaces/IDictionary';
import { Dictionary } from '../../../Classes/Dictionary';
import { IFood } from '../../../DataBase/Models/Food';
import { IProduct } from '../../../DataBase/Models/Product';
import { IFoodRecord } from '../../../DataBase/Models/FoodRecord';

export interface GetAllRecord {
    type: typeof GET_ALL_RECORDS_PRODUCT
    records: IDictionary<Array<IDiaryRecord>>
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

        let records: IDictionary<Array<IDiaryRecord>> = {}

        db.transaction(tr => {

            tr.executeSql(`select * from ${FOOD_TABLE} order by ${FOOD_TABLE_ID} desc`, [], (x,r) => {

                for (let index = 0; index < r.rows.length; index++) {
                    const element = r.rows.item(index);

                    const food:IFood = {
                        Id: element.Id,
                        DateAdd: element.DateAdd,
                        Name: element.Name
                    }

                    let dataProduct: IDataProduct = {
                        Calories: 0,
                        Carbohydrates: 0,
                        Fats: 0,
                        Gi: 0,
                        Proteins: 0,
                        Xe: 0,
                        weight: 0
                    }

                    x.executeSql(`select ${FOOD_RECORD_TABLE_PRODUCT_ID}, ${FOOD_RECORD_TABLE_NUMBERS_OF_GRAMS} from ${FOOD_RECORD_TABLE} where ${FOOD_RECORD_TABLE_FOOD_ID} = ${food.Id as number}`, [], (nt, rfp) => {

                        for (let index = 0; index < rfp.rows.length; index++) {
                            const elementFood = rfp.rows.item(index);

                            const foodRecord:IFoodRecord = {
                                NumbersOfGrams: parseInt(elementFood.NumbersOfGrams),
                                Product: {
                                    Id: parseInt(elementFood.Product_Id)
                                }
                            }

                            dataProduct.weight += foodRecord.NumbersOfGrams as number

                            const weight = (foodRecord.NumbersOfGrams as number) / 100

                            nt.executeSql(`select * from ${PRODUCTS_TABLE} where ${PRODUCTS_TABLE_ID} = ${foodRecord.Product?.Id as number}`, [], (tra, result) => {

                                const elementProduct = r.rows.item(0);

                                const int = (value:any) => parseInt(value);

                                const product:IProduct = {
                                    Calories: int(elementProduct.Calories),
                                    Carbohydrates: int(elementProduct.Carbohydrates),
                                    Fats: int(elementProduct.Fats),
                                    Gi: int(elementProduct.GI),
                                    Xe: int(elementProduct.XE),
                                    Proteins: elementProduct.Proteins
                                }

                                dataProduct.Calories += product.Calories as number * weight;
                                dataProduct.Carbohydrates += product.Carbohydrates as number * weight;
                                dataProduct.Fats += product.Fats as number * weight;
                                dataProduct.Gi += product.Gi as number * weight;
                                dataProduct.Xe += product.Xe as number * weight;
                                dataProduct.Proteins += product.Proteins as number * weight;


                            })
                        }
                    })

                    const date = new Date(food.DateAdd as string)

                    const dateString = date.toDateString();

                    const foodItem: IDiaryRecord = {
                        Date: date.toString(),
                        Type: TypeRecord.Product,
                        ObjectRecord: {
                            Id: food.Id as number,
                            Name: food.Name as string,
                            data: dataProduct
                        }
                    }

                    if (!records[dateString]) {

                        records = {
                            ...records, 
                            dateString: [] as Array<IDiaryRecord>
                        }
                    } 

                    records[dateString].push(foodItem);

                }
            })

            tr.executeSql(`select * from ${GLUCOSE_MEASUREMENT_TABLE}`,[],(x, r) => {

                for (let index = 0; index < r.rows.length; index++) {
                    const element = r.rows.item(index);

                    const glucose:IGlucoseMeasurement = {
                        Id: parseInt(element.Id),
                        DateAdd: element.DateAdd as string,
                        Level: parseInt(element.Level)
                    }

                    const dbDate = parseInt(glucose.DateAdd as string);

                    const date = new Date(dbDate).toDateString()

                    const glucoseRecord: IDiaryRecord = {
                        Date: date.toString(),
                        Type: TypeRecord.Glucose,
                        ObjectRecord: {
                            Id: glucose.Id as number,
                            Level: glucose.Level as number
                        }
                    }


                    if (!records[date]) {

                        records[date] = [] as Array<IDiaryRecord>;

                    } 

                    
                    records[date].push(glucoseRecord);
                }
            })
        }, error => {

            console.log('ERROR_GET_DIARY_RECORD', error);
            

        }, () => {

            console.log('OK');
            

            let count = 0;

            for (const key in records) { count++; }

            dispatch({type: GET_ALL_RECORDS_PRODUCT, records: records, countRecord: count});
        })
        
        

        
    }

}

