import { GET_ALL_RECORDS_PRODUCT, GET_STATISTIC } from '../../../constants/ActionsName';
import DbContext from '../../../DataBase/DataBase';
import {
    FOOD_RECORD_TABLE, FOOD_RECORD_TABLE_FOOD_ID, FOOD_RECORD_TABLE_NUMBERS_OF_GRAMS,
    FOOD_RECORD_TABLE_PRODUCT_ID, FOOD_TABLE, FOOD_TABLE_CARBOHYDRATE_RATIO, FOOD_TABLE_DATE_ADD,
    FOOD_TABLE_ID, FOOD_TABLE_INSULIN, GLUCOSE_MEASUREMENT_TABLE,
    GLUCOSE_MEASUREMENT_TABLE_DATE_ADD, GLUCOSE_MEASUREMENT_TABLE_LEVEL, PRODUCTS_TABLE,
    PRODUCTS_TABLE_CALORIES, PRODUCTS_TABLE_CARBOHYDRATES, PRODUCTS_TABLE_FATS, PRODUCTS_TABLE_GI,
    PRODUCTS_TABLE_ID, PRODUCTS_TABLE_PROTEINS, PRODUCTS_TABLE_XE
} from '../../../DataBase/DataBaseConst';
import { IFood } from '../../../DataBase/Models/Food';
import { IFoodRecord } from '../../../DataBase/Models/FoodRecord';
import { IGlucoseMeasurement } from '../../../DataBase/Models/GlucoseMeasurement';
import { IProduct } from '../../../DataBase/Models/Product';
import {
    IDataProduct, IDiaryRecord, IRecord, IRecordFoodDiary, IRecordGlucoseDiary, IStatistic,
    TypeRecord
} from '../../../Interfaces/IDiary';
import { IDictionary } from '../../../Interfaces/IDictionary';
import { IApplicationAction } from '../../StoreInterfaces';

export interface GetAllRecord {
    type: typeof GET_ALL_RECORDS_PRODUCT
    records: IDictionary<Array<IDiaryRecord<IRecordFoodDiary | IRecordGlucoseDiary>>>
    countRecord: number
}

export interface GetStatistic {
    type: typeof GET_STATISTIC
    statistic: IStatistic
}

export type DiaryPageType = GetAllRecord | GetStatistic



export const GetRecords = (): IApplicationAction<GetAllRecord> => (dispatch, getState) => {

    if (getState().Diary) {

        const db = DbContext();

        let records: IDictionary<Array<IDiaryRecord<IRecordFoodDiary | IRecordGlucoseDiary>>> = {};

        const times: Array<string> = [];

        db.transaction(tr => {

            tr.executeSql(`select ${FOOD_TABLE_DATE_ADD} from ${FOOD_TABLE}`, [], (x, r) => {

                for (let index = 0; index < r.rows.length; index++) {
                    const element = r.rows.item(index);
                    times.push(element.DateAdd);

                }

            })

            tr.executeSql(`select ${GLUCOSE_MEASUREMENT_TABLE_DATE_ADD} from ${GLUCOSE_MEASUREMENT_TABLE}`, [], (x, r) => {

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

            tr.executeSql(`select * from ${FOOD_TABLE} order by ${FOOD_TABLE_DATE_ADD} desc`, [], (x, r) => {

                for (let index = 0; index < r.rows.length; index++) {
                    const element = r.rows.item(index);

                    const food: IFood = {
                        Id: element.Id,
                        DateAdd: element.DateAdd,
                        Name: element.Name
                    }

                    let dataProduct: IDataProduct = {
                        Carbohydrates: 0,
                        CarbohydrateRatio: element.CarbohydrateRatio as number,
                        InsLevel: element.InsulineDose as number,
                        Xe: 0,
                        weight: 0
                    }

                    x.executeSql(`select ${FOOD_RECORD_TABLE_PRODUCT_ID}, ${FOOD_RECORD_TABLE_NUMBERS_OF_GRAMS} from ${FOOD_RECORD_TABLE} where ${FOOD_RECORD_TABLE_FOOD_ID} = ${food.Id as number}`, [], (nt, rfp) => {

                        for (let index = 0; index < rfp.rows.length; index++) {
                            const elementFood = rfp.rows.item(index);

                            const foodRecord: IFoodRecord = {
                                NumbersOfGrams: parseFloat(parseFloat(elementFood.NumbersOfGrams).toFixed(2)),
                                Product: {
                                    Id: parseInt(elementFood.Product_Id)
                                }
                            }

                            dataProduct.weight += foodRecord.NumbersOfGrams as number

                            const weight = (foodRecord.NumbersOfGrams as number) / 100

                            nt.executeSql(`select * from ${PRODUCTS_TABLE} where ${PRODUCTS_TABLE_ID} = ${foodRecord.Product?.Id as number}`, [], (tra, result) => {

                                // console.log(result);


                                const elementProduct = result.rows.item(0);

                                const int = (value: any) => parseFloat(value);

                                // console.log('AAAAA',elementProduct)

                                const product: IProduct = {
                                    Calories: int(elementProduct.Calories),
                                    Carbohydrates: int(elementProduct.Carbohydrates),
                                    Fats: int(elementProduct.Fats),
                                    Gi: int(elementProduct.GI),
                                    Xe: int(elementProduct.XE),
                                    Proteins: elementProduct.Proteins
                                }

                                dataProduct.Carbohydrates += parseFloat((product.Carbohydrates as number * weight).toFixed(2));
                                dataProduct.Xe += parseFloat((product.Xe as number * weight).toFixed(2));


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

                        records[dateString] = [] as Array<IDiaryRecord<IRecordFoodDiary | IRecordGlucoseDiary>>;
                    }

                    records[dateString].push(foodItem);

                }
            })

            tr.executeSql(`select * from ${GLUCOSE_MEASUREMENT_TABLE} order by ${GLUCOSE_MEASUREMENT_TABLE_DATE_ADD} desc`, [], (x, r) => {

                for (let index = 0; index < r.rows.length; index++) {
                    const element = r.rows.item(index);

                    const glucose: IGlucoseMeasurement = {
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

                        records[dateString] = [] as Array<IDiaryRecord<IRecordFoodDiary | IRecordGlucoseDiary>>;

                    }

                    records[dateString].push(glucoseRecord);
                }
            })
        }, error => {

            console.log('ERROR_GET_DIARY_RECORD', error);

        }, () => {

            let count: number = 0;

            for (const key in records) {
                count++;
            }

            dispatch({ type: GET_ALL_RECORDS_PRODUCT, records: records, countRecord: count });
        })




    }

}

export const GetStatistic = (): IApplicationAction<GetStatistic> => (dispatch, getState) => {

    const db = DbContext();

    let statistic: IStatistic = {
        Glucose: {
            Avg: 0,
            Max: 0,
            Min: 0
        },
        Product: {
            CarbohydrateRatio: 0,
            InsLevel: 0,
            Carbohydrates: 0,
            Xe: 0
        }
    }

    let carb = 0
    let xe = 0
    let count = 0

    db.transaction(tr => {

        tr.executeSql(`select avg(${GLUCOSE_MEASUREMENT_TABLE_LEVEL}) as AVG_G, min(${GLUCOSE_MEASUREMENT_TABLE_LEVEL}) as MIN_G, max(${GLUCOSE_MEASUREMENT_TABLE_LEVEL}) as MAX_G from ${GLUCOSE_MEASUREMENT_TABLE}`, [], (x, r) => {

            const values = r.rows.item(0);

            statistic.Glucose.Avg = parseFloat(((values.AVG_G ?? 0) as number).toFixed(2));
            statistic.Glucose.Min = parseFloat(((values.MIN_G ?? 0) as number).toFixed(2));
            statistic.Glucose.Max = parseFloat(((values.MAX_G ?? 0) as number).toFixed(2));
        })

        tr.executeSql(`select avg(${FOOD_TABLE_INSULIN}) as Ins, avg(${FOOD_TABLE_CARBOHYDRATE_RATIO}) as CarbRat from ${FOOD_TABLE} `, [], (nt, r) => {
            const avgValue = r.rows.item(0);

            statistic.Product.InsLevel = avgValue.Ins as number
            statistic.Product.CarbohydrateRatio = avgValue.CarbRat as number
        })


        tr.executeSql(`select ${FOOD_TABLE_ID} from ${FOOD_TABLE}`, [], (nt, r) => {

            count = r.rows.length

            for (let index = 0; index < r.rows.length; index++) {
                const element = r.rows.item(index);

                nt.executeSql(`select pr.${PRODUCTS_TABLE_XE} as Xe, pr.${PRODUCTS_TABLE_CARBOHYDRATES} as Carb, fr.${FOOD_RECORD_TABLE_NUMBERS_OF_GRAMS} as Weight from ${FOOD_RECORD_TABLE} fr join ${PRODUCTS_TABLE} pr on pr.${PRODUCTS_TABLE_ID} = fr.${FOOD_RECORD_TABLE_PRODUCT_ID} where ${FOOD_RECORD_TABLE_FOOD_ID} = ${element.Id}`, [], (t, res) => {

                    const tmpCount = res.rows.length;
                    let avgXe = 0;

                    for (let index = 0; index < res.rows.length; index++) {
                        const prod = res.rows.item(index);

                        xe += (parseFloat(prod['Xe']) as number) * ((prod['Weight'] as number) / 100);
                        carb += (prod['Carb'] as number) * (prod['Weight'] as number) / 100;

                    }


                })
            }
        })


    }, error => {
        console.log(error);
    }, () => {

        statistic.Product.Carbohydrates = carb / count;
        statistic.Product.Xe = xe / count

        dispatch({ type: GET_STATISTIC, statistic })
    })

}

