import { FOOD_TABLE, GLUCOSE_MEASUREMENT_TABLE, FOOD_TABLE_NAME, FOOD_TABLE_DATE_ADD, FOOD_TABLE_CARBOHYDRATE_RATIO, FOOD_TABLE_INSULIN, FOOD_TABLE_ID } from './../../../DataBase/DataBaseConst';
// import RNFS, { writeFile } from 'react-native-fs';
import { IApplicationAction } from './../../StoreInterfaces';
import { EXPORT_LOADING, IMPORT_LOADING, SET_NEW_MEASUREMENT } from "../../../constants/ActionsName";
import moment from 'moment';
import DbContext from '../../../DataBase/DataBase';
import * as FileSystem from 'expo-file-system'
import { CameraRoll } from 'react-native';




interface SetMeasurementAction {
    type: typeof SET_NEW_MEASUREMENT
    text: string
}

interface ImportLoadingAction {
    type:typeof IMPORT_LOADING
    importLoad:boolean
}

interface ExportLoadingAction {
    type:typeof EXPORT_LOADING
    exportLoad:boolean
}

type LoadingAction = ImportLoadingAction | ExportLoadingAction
export type SettingsAction = SetMeasurementAction | LoadingAction;

export const SetMeasurement = (value:string):IApplicationAction<SetMeasurementAction> => (dispatch, getState) => dispatch({type: SET_NEW_MEASUREMENT, text:value});


const getNameFile = ():string => {

    const date = new Date();
    const momDate = moment(date);

    const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    const diff = (+date - +today); // разница в миллисекундах

    return `${momDate.format('YYYYMMDD')}_${diff}.json`;
}

async function ensureDirExists() {
    
    const dirInfo = await FileSystem.getInfoAsync(`content://com.android.externalstorage.documents/tree/primary%3A/TEST_FOLDER`?? 'file:///data');
    if (!dirInfo.exists) {
      console.log("Gif directory doesn't exist, creating...");
      await FileSystem.makeDirectoryAsync(`content://com.android.externalstorage.documents/tree/primary%3A/TEST_FOLDER` ?? 'file:///data', { intermediates: true });
    }
  }

  

export const ImportData = ():IApplicationAction<LoadingAction> => (dispatch, getState) => {

    // ensureDirExists()

    dispatch({type:IMPORT_LOADING, importLoad:true});

    const db = DbContext();

    // console.log(TEST);
    
    // console.log(RNFS);
    
    
    // const fileName2 = `${RNFS.DocumentDirectoryPath}/${getNameFile()}`


    const fileName = `${FileSystem.documentDirectory}/${getNameFile()}`

    // const info = FileSystem.

    

    // console.log(fileName);
    

    const outJson = {
        glucose: '',
        food:''
    }

    db.transaction(tr => {


        tr.executeSql(`select * from ${GLUCOSE_MEASUREMENT_TABLE}`,[],(t,r) => {

            const arr = []

            for (let index = 0; index < r.rows.length; index++) {
                arr.push(r.rows.item(index))
            }

            outJson.glucose = JSON.stringify(arr);

        })

        tr.executeSql(`select * from ${FOOD_TABLE}`, [], (nt,r) => {

            const foodArr = []

            for (let index = 0; index < r.rows.length; index++) {
                const food = r.rows.item(0);

                const foodObj = {
                    name: food[FOOD_TABLE_NAME],
                    date: food[FOOD_TABLE_DATE_ADD],
                    ratio: food[FOOD_TABLE_CARBOHYDRATE_RATIO],
                    insulin: food[FOOD_TABLE_INSULIN],
                    products:[] as Array<any>
                }

                nt.executeSql(`select p.Name as NameProduct, p.GI, p.XE, p.Fats, p.Proteins, p.Carbohydrates, p.Calories, pg.Name as NameGroup from FoodRecords fr join Products p on fr.Product_Id = p.Id join ProductGroups pg on pg.Id = p.ProductGroup_id where fr.Food_Id = ${food[FOOD_TABLE_ID]};`,[],(t,result) => {

                    for (let index = 0; index < result.rows.length; index++) {
                        const product = result.rows.item(index);
                        
                        const productObj = {
                            nameProd: product['NameProduct'],
                            gi:product['GI'],
                            xe:product['XE'],
                            fats: product['Fats'],
                            proteins: product['Proteins'],
                            carbohydrates: product['Carbohydrates'],
                            calories: product['Calories'],
                            group: product['NameGroup']
                        }

                        foodObj.products.push(productObj);
                    }

                })

                foodArr.push(foodObj);
                
            }

        })



    }, error => {
        console.log(error);
        dispatch({type:IMPORT_LOADING, importLoad:false});
    }, () => {


        // console.log(FileSystem.bundledAssets);
        // console.log(FileSystem.bundleDirectory);
        // console.log(FileSystem.cacheDirectory);
        // console.log(FileSystem.documentDirectory);
        // console.log(FileSystem.FileSystemUploadType);
        // console.log(FileSystem.FileSystemSessionType);
        
        FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync().then(d => {
            if (d.granted) {
                const filePath = d.directoryUri;

                FileSystem.writeAsStringAsync(`${filePath}/${getNameFile()}`, JSON.stringify(outJson), {encoding: 'utf8'});

                // FileSystem.StorageAccessFramework.writeAsStringAsync(`${filePath}/${getNameFile()}`, JSON.stringify(outJson), {encoding:'utf8'}).then(() => {
                //     console.log('FILE WRITE!');
                    
                // });
            }
        })

        // FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync().then(d => {

        //     if (d.granted) {
        //         const ds = d.directoryUri;
        //         console.log('DS',ds);
                
        //     }
            

        // })


        // FileSystem.getFreeDiskStorageAsync().then(d => {
        //     console.log(d);
            
        // })
    
        // FileSystem.readDirectoryAsync(FileSystem.bundledAssets ?? '').then(d => {
        //     d.map((v,i) => {
        //         console.log(v);
                
        //     })
        // })

        // FileSystem.writeAsStringAsync(fileName, JSON.stringify(outJson), {encoding: 'utf8'});
        // writeFile(fileName,JSON.stringify(outJson))
        // console.log(JSON.stringify(outJson));
        
        dispatch({type:IMPORT_LOADING, importLoad:false});
    })


}

export const ExportData = ():IApplicationAction<LoadingAction> => (dispatch, getState) => {
    
    dispatch({type:EXPORT_LOADING, exportLoad:true});

    //Logic

    dispatch({type:EXPORT_LOADING, exportLoad:false});

}

