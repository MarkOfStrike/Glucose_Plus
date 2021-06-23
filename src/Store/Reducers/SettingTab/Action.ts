import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import moment from 'moment';
// import { Files } from 'react-native-android-files';
import { CameraRoll, Linking } from 'react-native';
import RNFS, { writeFile } from 'react-native-fs';

import {
    EXPORT_LOADING, IMPORT_LOADING, SET_NEW_MEASUREMENT, SHOW_EXPORT_MESSAGE, SHOW_IMPORT_MESSAGE
} from '../../../constants/ActionsName';
import DbContext from '../../../DataBase/DataBase';
import {
    FOOD_RECORD_TABLE, FOOD_RECORD_TABLE_FOOD_ID, FOOD_RECORD_TABLE_NUMBERS_OF_GRAMS,
    FOOD_RECORD_TABLE_PRODUCT_ID, FOOD_TABLE, FOOD_TABLE_CARBOHYDRATE_RATIO, FOOD_TABLE_DATE_ADD,
    FOOD_TABLE_ID, FOOD_TABLE_INSULIN, FOOD_TABLE_NAME, GLUCOSE_MEASUREMENT_TABLE,
    GLUCOSE_MEASUREMENT_TABLE_DATE_ADD, GLUCOSE_MEASUREMENT_TABLE_LEVEL, PRODUCTS_TABLE,
    PRODUCTS_TABLE_CALORIES, PRODUCTS_TABLE_CARBOHYDRATES, PRODUCTS_TABLE_FATS, PRODUCTS_TABLE_GI,
    PRODUCTS_TABLE_ID, PRODUCTS_TABLE_NAME, PRODUCTS_TABLE_PROTEINS, PRODUCTS_TABLE_XE
} from '../../../DataBase/DataBaseConst';
import { IApplicationAction } from '../../StoreInterfaces';
import { IShowMessage } from './Reducer';

interface SetMeasurementAction {
    type: typeof SET_NEW_MEASUREMENT
    text: string
}

interface ImportLoadingAction {
    type: typeof IMPORT_LOADING
    importLoad: boolean
}

interface ExportLoadingAction {
    type: typeof EXPORT_LOADING
    exportLoad: boolean
}



interface ImportMessageAction extends IShowMessage {
    type: typeof SHOW_IMPORT_MESSAGE
}

interface ExportMessageAction extends IShowMessage {
    type: typeof SHOW_EXPORT_MESSAGE
}

type MessageAction = ImportMessageAction | ExportMessageAction;
type LoadingAction = ImportLoadingAction | ExportLoadingAction;
export type SettingsAction = SetMeasurementAction | LoadingAction | MessageAction;

export const SetMeasurement = (value: string): IApplicationAction<SetMeasurementAction> => (dispatch, getState) => dispatch({ type: SET_NEW_MEASUREMENT, text: value });


const getNameFile = (): string => {

    const date = new Date();
    const momDate = moment(date);

    const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    const diff = (+date - +today); // разница в миллисекундах

    return `${momDate.format('YYYYMMDD')}_${diff}.json`;
}

export const ExportData = (): IApplicationAction<MessageAction> => (dispatch, getState) => {

    dispatch({ type: SHOW_IMPORT_MESSAGE, show: false, message: '' });

    const db = DbContext();

    const outJson = {
        glucose: '',
        food: ''
    }

    const foodArr: Array<any> = []

    db.transaction(tr => {

        tr.executeSql(`select * from ${GLUCOSE_MEASUREMENT_TABLE}`, [], (t, r) => {

            const arr = []

            for (let index = 0; index < r.rows.length; index++) {
                arr.push(r.rows.item(index))
            }

            outJson.glucose = JSON.stringify(arr);

        })

        tr.executeSql(`select * from ${FOOD_TABLE}`, [], (nt, r) => {

            for (let index = 0; index < r.rows.length; index++) {
                const food = r.rows.item(index);

                const foodObj = {
                    name: food[FOOD_TABLE_NAME],
                    date: food[FOOD_TABLE_DATE_ADD],
                    ratio: food[FOOD_TABLE_CARBOHYDRATE_RATIO],
                    insulin: food[FOOD_TABLE_INSULIN],
                    products: [] as Array<any>
                }

                nt.executeSql(`select p.Name as NameProduct, p.GI, p.XE, p.Fats, p.Proteins, p.Carbohydrates, p.Calories, pg.Name as NameGroup, fr.${FOOD_RECORD_TABLE_NUMBERS_OF_GRAMS} as ${FOOD_RECORD_TABLE_NUMBERS_OF_GRAMS} from FoodRecords fr join Products p on fr.Product_Id = p.Id join ProductGroups pg on pg.Id = p.ProductGroup_id where fr.Food_Id = ${food[FOOD_TABLE_ID]}`, [], (t, result) => {

                    for (let index = 0; index < result.rows.length; index++) {
                        const product = result.rows.item(index);

                        const productObj = {
                            nameProd: product['NameProduct'],
                            gi: product['GI'],
                            xe: product['XE'],
                            fats: product['Fats'],
                            proteins: product['Proteins'],
                            carbohydrates: product['Carbohydrates'],
                            calories: product['Calories'],
                            group: product['NameGroup'],
                            weight: product[FOOD_RECORD_TABLE_NUMBERS_OF_GRAMS]
                        }

                        foodObj.products.push(productObj);
                    }

                })

                foodArr.push(foodObj);

            }

        })

    }, error => {
        console.log(error);
        dispatch({ type: SHOW_IMPORT_MESSAGE, show: false, message: '' });
    }, () => {

        if (foodArr.length > 0) {
            outJson.food = JSON.stringify(foodArr);
        }

        MediaLibrary.requestPermissionsAsync().then(d => {
      
            if (d && d.status === "granted") {

                FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync().then(d => {

                    if (d.granted) {
                        const filePath = d.directoryUri;
                        const fileName = getNameFile();


                        FileSystem.StorageAccessFramework.createFileAsync(filePath, fileName, 'application/json').then(d => {
                            FileSystem.writeAsStringAsync(d, JSON.stringify(outJson), { encoding: FileSystem.EncodingType.UTF8 });
                            const message = `Экспорт данных завершен! Данные сохранены в файл ${fileName}`
                            dispatch({ type: SHOW_IMPORT_MESSAGE, show: true, message: message });
                        })

                    } else {
                        dispatch({ type: SHOW_IMPORT_MESSAGE, show: true, message: 'Экспорт данных не выполнен' });
                    }

                })
            } else {
                dispatch({ type: SHOW_IMPORT_MESSAGE, show: true, message: 'Экспорт данных не выполнен' });
            }
        });



    })


}

export const ImportData = (): IApplicationAction<MessageAction> => (dispatch, getState) => {

    dispatch({ type: SHOW_EXPORT_MESSAGE, show: false, message: '' });

    const db = DbContext();


    MediaLibrary.requestPermissionsAsync().then(d => {

        if (d && d.status === "granted") {
            DocumentPicker.getDocumentAsync().then(ur => {

                if (ur.type === 'success') {

                    if (ur.name.split('.').pop() === 'json') {
                        FileSystem.readAsStringAsync(ur.uri, { encoding: FileSystem.EncodingType.UTF8 }).then(result => {

                            const exportObj = JSON.parse(result);

                            console.log(exportObj);
                            

                            db.transaction(tr => {

                                if (exportObj.glucose) {

                                    const gluMas = JSON.parse(exportObj.glucose);

                                    gluMas.forEach((v: any, i: number) => {

                                        const qr = `INSERT INTO ${GLUCOSE_MEASUREMENT_TABLE} (${GLUCOSE_MEASUREMENT_TABLE_DATE_ADD}, ${GLUCOSE_MEASUREMENT_TABLE_LEVEL}) SELECT ${v.DateAdd}, ${v.Level} WHERE NOT EXISTS (SELECT 1 FROM ${GLUCOSE_MEASUREMENT_TABLE} WHERE ${GLUCOSE_MEASUREMENT_TABLE_DATE_ADD} = ${v.DateAdd} and ${GLUCOSE_MEASUREMENT_TABLE_LEVEL} = ${v.Level})`;

                                        tr.executeSql(qr)

                                    })

                                }

                                if (exportObj.food) {

                                    const f_mas = JSON.parse(exportObj.food);

                                    f_mas.forEach((f:any, i:number) => {

                                        tr.executeSql(`select ${FOOD_TABLE_ID} from ${FOOD_TABLE} where ${FOOD_TABLE_NAME} = \'${f.name}\' and ${FOOD_TABLE_DATE_ADD} = ${f.date} and ${FOOD_TABLE_INSULIN} = ${f.insulin} and ${FOOD_TABLE_CARBOHYDRATE_RATIO} = ${f.ratio}`, [], (t, r) => {

                                            if (r.rows.length === 0) {

                                                const tmp = `INSERT INTO ${FOOD_TABLE} (${FOOD_TABLE_NAME}, ${FOOD_TABLE_DATE_ADD}, ${FOOD_TABLE_INSULIN}, ${FOOD_TABLE_CARBOHYDRATE_RATIO}) `
                                                const sel = `SELECT \'${f.name}\', ${f.date}, ${f.insulin}, ${f.ratio} WHERE NOT EXISTS `

                                                const checkSelect = `(select 1 from ${FOOD_TABLE} where ${FOOD_TABLE_NAME} = \'${f.name}\' and ${FOOD_TABLE_DATE_ADD} = ${f.date} and ${FOOD_TABLE_INSULIN} = ${f.insulin} and ${FOOD_TABLE_CARBOHYDRATE_RATIO} = ${f.ratio})`

                                                const query = tmp + sel + checkSelect;

                                                t.executeSql(query, [], (nt, res) => {

                                                    const foodId = res.insertId;

                                                    f.products.map((v: any, i: number) => {

                                                        const selectProduct = `(select ${PRODUCTS_TABLE_ID} from ${PRODUCTS_TABLE} where ` +
                                                            `${PRODUCTS_TABLE_NAME} = \'${v.nameProd}\' ` +
                                                            `and ${PRODUCTS_TABLE_GI} = ${v.gi} ` +
                                                            `and ${PRODUCTS_TABLE_XE} = ${v.xe} ` +
                                                            `and ${PRODUCTS_TABLE_FATS} = ${v.fats} ` +
                                                            `and ${PRODUCTS_TABLE_PROTEINS} = ${v.proteins} ` +
                                                            `and ${PRODUCTS_TABLE_CARBOHYDRATES} = ${v.carbohydrates} ` +
                                                            `and ${PRODUCTS_TABLE_CALORIES} = ${v.calories})`

                                                        const qw = `insert into ${FOOD_RECORD_TABLE} (${FOOD_RECORD_TABLE_FOOD_ID}, ${FOOD_RECORD_TABLE_PRODUCT_ID}, ${FOOD_RECORD_TABLE_NUMBERS_OF_GRAMS}) values (${foodId}, ${selectProduct}, ${v.weight})`

                                                        nt.executeSql(qw);

                                                    })

                                                })

                                            }

                                        })
                                        
                                    });
                                    
                                }



                            }, error => {
                                console.log(error);

                            }, () => {
                                dispatch({ type: SHOW_IMPORT_MESSAGE, show: true, message: 'Импорт данных выполнен успешно!' });
                            })

                        });
                    }
                } else {
                    dispatch({ type: SHOW_EXPORT_MESSAGE, show: true, message: 'Ошибка импорта данных!' });
                }
            })
        } else {
            dispatch({ type: SHOW_EXPORT_MESSAGE, show: true, message: 'Ошибка импорта данных!' });
        }
    });



}

