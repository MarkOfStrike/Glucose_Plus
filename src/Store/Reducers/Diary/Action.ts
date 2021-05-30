import { IGlucoseMeasurement } from './../../../DataBase/Models/GlucoseMeasurement';
import { FOOD_TABLE, FOOD_TABLE_DATE_ADD, GLUCOSE_MEASUREMENT_TABLE, GLUCOSE_MEASUREMENT_TABLE_DATE_ADD, FOOD_TABLE_ID, FOOD_RECORD_TABLE_PRODUCT_ID, FOOD_RECORD_TABLE_NUMBERS_OF_GRAMS, FOOD_RECORD_TABLE_FOOD_ID, PRODUCTS_TABLE, PRODUCTS_TABLE_ID, GLUCOSE_MEASUREMENT_TABLE_LEVEL, PRODUCTS_TABLE_CALORIES, PRODUCTS_TABLE_CARBOHYDRATES, PRODUCTS_TABLE_FATS, PRODUCTS_TABLE_GI, PRODUCTS_TABLE_PROTEINS, PRODUCTS_TABLE_XE } from './../../../DataBase/DataBaseConst';
import { FOOD_RECORD_TABLE } from '../../../DataBase/DataBaseConst';
import { IApplicationAction } from '../../StoreInterfaces';
import { GET_ALL_RECORDS_PRODUCT, GET_STATISTIC } from "../../../constants/ActionsName";
import { IDataProduct, IDiaryRecord, IRecord, IRecordFoodDiary, IRecordGlucoseDiary, IStatistic, TypeRecord } from "../../../Interfaces/IDiary";
import DbContext from '../../../DataBase/DataBase';
import { IDictionary } from '../../../Interfaces/IDictionary';
import { IFood } from '../../../DataBase/Models/Food';
import { IProduct } from '../../../DataBase/Models/Product';
import { IFoodRecord } from '../../../DataBase/Models/FoodRecord';

export interface GetAllRecord {
    type: typeof GET_ALL_RECORDS_PRODUCT
    records: IDictionary<Array<IDiaryRecord<IRecordFoodDiary|IRecordGlucoseDiary>>>
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

        let records: IDictionary<Array<IDiaryRecord<IRecordFoodDiary|IRecordGlucoseDiary>>> = {};

        const times:Array<string> = [];

        db.transaction(tr => {

            tr.executeSql(`select ${FOOD_TABLE_DATE_ADD} from ${FOOD_TABLE}`, [], (x,r) => {

                for (let index = 0; index < r.rows.length; index++) {
                    const element = r.rows.item(index);
                    times.push(element.DateAdd);
                    
                }

            })

            tr.executeSql(`select ${GLUCOSE_MEASUREMENT_TABLE_DATE_ADD} from ${GLUCOSE_MEASUREMENT_TABLE}`, [], (x,r) => {

                for (let index = 0; index < r.rows.length; index++) {
                    const element = r.rows.item(index);
                    times.push(element.DateAdd as string);
                    
                }

            })

        }, error => {

            console.log('READ_DATE_RECORDS', error);

        }, () => {
            
            times.sort().reverse().map((v, i) => {
                const date = new Date(parseInt(v)).toDateString();
                records[date] = []
            });
            
        })

        db.transaction(tr => {

            tr.executeSql(`select * from ${FOOD_TABLE} order by ${FOOD_TABLE_DATE_ADD} desc`, [], (x,r) => {

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

                                const elementProduct = result.rows.item(0);

                                const int = (value:any) => parseInt(value);

                                // console.log('AAAAA',elementProduct)

                                const product:IProduct = {
                                    Calories: int(elementProduct.Calories),
                                    Carbohydrates: int(elementProduct.Carbohydrates),
                                    Fats: int(elementProduct.Fats),
                                    Gi: int(elementProduct.GI),
                                    Xe: int(elementProduct.XE),
                                    Proteins: elementProduct.Proteins
                                }

                                dataProduct.Calories = parseFloat((dataProduct.Calories + (product.Calories as number * weight)).toFixed(2));
                                dataProduct.Carbohydrates = parseFloat((dataProduct.Carbohydrates + (product.Carbohydrates as number * weight)).toFixed(2));
                                dataProduct.Fats = parseFloat((dataProduct.Fats + (product.Fats as number * weight)).toFixed(2));
                                dataProduct.Gi = parseFloat((dataProduct.Gi + (product.Gi as number * weight)).toFixed(2));
                                dataProduct.Xe = parseFloat((dataProduct.Xe + (product.Xe as number * weight)).toFixed(2));
                                dataProduct.Proteins = parseFloat((dataProduct.Proteins + (product.Proteins as number * weight)).toFixed(2));


                            })
                        }
                    })

                    const date = new Date(parseInt(food.DateAdd as string));
                    const dateString = date.toDateString();

                    const foodItem: IDiaryRecord<IRecordFoodDiary> = {
                        Date: date.toString(),
                        Type: TypeRecord.Product,
                        ObjectRecord: {
                            Id: food.Id as number,
                            Name: food.Name as string,
                            data: dataProduct
                        }
                    }

                    if (!records[dateString]) {

                        records[dateString] = [] as Array<IDiaryRecord<IRecordFoodDiary|IRecordGlucoseDiary>>;
                    } 

                    records[dateString].push(foodItem);

                }
            })

            tr.executeSql(`select * from ${GLUCOSE_MEASUREMENT_TABLE} order by ${GLUCOSE_MEASUREMENT_TABLE_DATE_ADD} desc`,[],(x, r) => {

                for (let index = 0; index < r.rows.length; index++) {
                    const element = r.rows.item(index);

                    const glucose:IGlucoseMeasurement = {
                        Id: parseInt(element.Id),
                        DateAdd: element.DateAdd as string,
                        Level: parseInt(element.Level)
                    }

                    const date = new Date(parseInt(glucose.DateAdd as string));
                    const dateString = date.toDateString();

                    const glucoseRecord: IDiaryRecord<IRecordGlucoseDiary> = {
                        Date: date.toString(),
                        Type: TypeRecord.Glucose,
                        ObjectRecord: {
                            Id: glucose.Id as number,
                            Level: glucose.Level as number
                        }
                    }

                    if (!records[dateString]) {

                        records[dateString] = [] as Array<IDiaryRecord<IRecordFoodDiary|IRecordGlucoseDiary>>;

                    } 

                    records[dateString].push(glucoseRecord);
                }
            })
        }, error => {

            console.log('ERROR_GET_DIARY_RECORD', error);
            
        }, () => {

            let count:number = 0;

            for (const key in records) { 
                count++; 
            }

            dispatch({type: GET_ALL_RECORDS_PRODUCT, records: records, countRecord: count});
        })
        
        

        
    }

}

export const GetStatistic = ():IApplicationAction<GetStatistic> => (dispatch, getState) => {

    const db = DbContext();

    let statistic:IStatistic = {
        Glucose:{
            Avg:0,
            Max: 0,
            Min: 0
        },
        Product: {
            Calories: 0,
            Carbohydrates: 0,
            Fats: 0,
            Gi: 0,
            Proteins: 0,
            Xe: 0
        }
    }

    db.transaction(tr => {

        tr.executeSql(`select avg(${GLUCOSE_MEASUREMENT_TABLE_LEVEL}) as AVG_G, min(${GLUCOSE_MEASUREMENT_TABLE_LEVEL}) as MIN_G, max(${GLUCOSE_MEASUREMENT_TABLE_LEVEL}) as MAX_G from ${GLUCOSE_MEASUREMENT_TABLE}`, [], (x,r) => {

            const values = r.rows.item(0);

            statistic.Glucose.Avg = parseFloat(((values.AVG_G ?? 0) as number).toFixed(2));
            statistic.Glucose.Min = parseFloat(((values.MIN_G ?? 0) as number).toFixed(2));
            statistic.Glucose.Max = parseFloat(((values.MAX_G ?? 0) as number).toFixed(2));

        })

        tr.executeSql(`select avg(pr.${PRODUCTS_TABLE_CALORIES}) as Calories, avg(pr.${PRODUCTS_TABLE_CARBOHYDRATES}) as Carbohydrates, avg(pr.${PRODUCTS_TABLE_FATS}) as Fats, avg(pr.${PRODUCTS_TABLE_GI}) as Gi, avg(pr.${PRODUCTS_TABLE_PROTEINS}) as Proteins,avg(pr.${PRODUCTS_TABLE_XE}) as Xe from ${FOOD_RECORD_TABLE} fr join ${PRODUCTS_TABLE} pr on fr.${FOOD_RECORD_TABLE_PRODUCT_ID} = pr.${PRODUCTS_TABLE_ID}`, [], (x,r) => {

            const values = r.rows.item(0);

            statistic.Product.Calories = values.Calories ?? 0;
            statistic.Product.Carbohydrates = values.Carbohydrates ?? 0;
            statistic.Product.Fats = values.Fats ?? 0;
            statistic.Product.Gi = values.Gi ?? 0;
            statistic.Product.Proteins = values.Proteins ?? 0;
            statistic.Product.Xe = values.Xe ?? 0;

        })


    }, error => {
        console.log(error);
    }, () => {
        dispatch({type: GET_STATISTIC, statistic})
    })

}

