import {
    PRODUCTS_TABLE,
    PRODUCTS_TABLE_NAME,
    PRODUCTS_TABLE_GI,
    PRODUCTS_TABLE_XE,
    PRODUCTS_TABLE_FATS,
    PRODUCTS_TABLE_PROTEINS,
    PRODUCTS_TABLE_CARBOHYDRATES,
    PRODUCTS_TABLE_GROUP,
    PRODUCT_GROUP_TABLE_ID,
    PRODUCT_GROUP_TABLE,
    PRODUCT_GROUP_TABLE_NAME,
    FOOD_RECORD_TABLE,
    FOOD_RECORD_TABLE_FOOD_ID,
    FOOD_RECORD_TABLE_PRODUCT_ID,
    FOOD_TABLE,
    FOOD_TABLE_NAME,
    FOOD_TABLE_DATE_ADD
} from './../DataBaseConst';

import DbContext from '../DataBase';

const InsertQuery = (query: string) => {
    const db = DbContext();

    db.transaction((e) => {
        e.executeSql(query, [], ((e, results) => {
            console.log("Insert completed");
        }))


    })


}

const FoodAdd = (nameFood: string) => {
    const query: string = `insert into ${FOOD_TABLE} (${FOOD_TABLE_NAME}, ${FOOD_TABLE_DATE_ADD}) values ('${nameFood}', '${new Date()}');`
    InsertQuery(query);
}

/**
 * Добавление нового продукта
 * 
 * @param props 
 */
export const ProductAdd = (props: any) => {

    const fields = `${PRODUCTS_TABLE_NAME}, ${PRODUCTS_TABLE_GI}, ${PRODUCTS_TABLE_XE}, ${PRODUCTS_TABLE_FATS}, ${PRODUCTS_TABLE_PROTEINS}, ${PRODUCTS_TABLE_CARBOHYDRATES}, ${PRODUCTS_TABLE_GROUP}`
    const idGroup = `(select ${PRODUCT_GROUP_TABLE_ID} from ${PRODUCT_GROUP_TABLE} where ${PRODUCT_GROUP_TABLE_NAME} = '${props.nameGroup}')`

    const query: string = `insert into ${PRODUCTS_TABLE} (${fields}) values ('${props.product.name}', ${props.product.gi}, ${props.product.xe}, ${props.product.fats}, ${props.product.proteins}, ${props.product.carbogydrates}, ${idGroup});`

    InsertQuery(query);
}

/**
 * Добавление новой группы продуктов
 * 
 * @param nameGroup 
 */
export const ProductGroupAdd = (nameGroup: string) => {

    const query: string = `insert into ${PRODUCT_GROUP_TABLE} (${PRODUCT_GROUP_TABLE_NAME}) values ('${nameGroup}');`

    InsertQuery(query);

}

export function FoodRecordAdd(nameFood: string, products: Array<number>): void;
export function FoodRecordAdd(idFood: number, products: Array<number>): void;
export function FoodRecordAdd(food: any, products: Array<number>): void {

    let idFood = `${food}`;

    if (typeof food == 'string') {
        FoodAdd(food);
        idFood = `(SELECT last_insert_rowid() from ${FOOD_TABLE})`;
    }

    products.map((idProduct, i) => {
        const query = `insert into ${FOOD_RECORD_TABLE} (${FOOD_RECORD_TABLE_FOOD_ID}, ${FOOD_RECORD_TABLE_PRODUCT_ID}) values (${idFood}, ${idProduct})`
        InsertQuery(query);
    })

}
