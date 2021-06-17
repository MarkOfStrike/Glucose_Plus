import DbContext from '../DataBase';
import {
    FOOD_RECORD_TABLE, FOOD_RECORD_TABLE_FOOD_ID, FOOD_TABLE, FOOD_TABLE_ID, FOOD_TABLE_NAME
} from '../DataBaseConst';
import { DeleteRecord } from './DeleteQuery';
import { FoodRecordAdd } from './InsertQuery';

const UpdateQuery = (query:string) => {

    const db = DbContext();

    db.transaction((tr) => {
        tr.executeSql(query,[]);
    })

    db.close();

}


const UpdateFood = (id:number,newName:string) => {
    const query = `update ${FOOD_TABLE} set ${FOOD_TABLE_NAME} = '${newName}' where ${FOOD_TABLE_ID} = ${id};`
    UpdateQuery(query);
}

const UpdateRecord = (idFood: number, idProduct: Array<number>) => {

    const deleteFoodRecord = {
        table: FOOD_RECORD_TABLE,
        where: `where ${FOOD_RECORD_TABLE_FOOD_ID} = ${idFood}`
    }

    DeleteRecord(deleteFoodRecord);

    FoodRecordAdd(idFood, idProduct);
}

