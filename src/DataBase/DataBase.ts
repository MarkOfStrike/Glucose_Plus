import { USER_INFO_TABLE, GLUCOSE_MEASUREMENT_TABLE, FOOD_TABLE, PRODUCTS_TABLE, PRODUCT_GROUP_TABLE, FOOD_RECORD_TABLE, PRODUCT_GROUP_TABLE_NAME, PRODUCT_GROUP_TABLE_ID, PRODUCTS_TABLE_NAME, PRODUCTS_TABLE_GI, PRODUCTS_TABLE_XE, PRODUCTS_TABLE_FATS, PRODUCTS_TABLE_PROTEINS, PRODUCTS_TABLE_CARBOHYDRATES, PRODUCTS_TABLE_CALORIES, PRODUCTS_TABLE_GROUP } from './DataBaseConst';
import React from 'react';

import * as SQLite from 'expo-sqlite';
import { IProduct } from './Models/Product';
import { IGroup } from './Models/ProductGroup';
import { Group } from '../Store/Reducers/AddProduct/Reducer';


const DbContext = () => {

    const d = SQLite.openDatabase('UserData.db');

    if(d){
        
    }
    return d;

}

export default DbContext;



