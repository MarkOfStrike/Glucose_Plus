import * as SQLite from 'expo-sqlite';
import React from 'react';

import { Group } from '../Store/Reducers/AddProduct/Reducer';
import {
    FOOD_RECORD_TABLE, FOOD_TABLE, GLUCOSE_MEASUREMENT_TABLE, PRODUCT_GROUP_TABLE,
    PRODUCT_GROUP_TABLE_ID, PRODUCT_GROUP_TABLE_NAME, PRODUCTS_TABLE, PRODUCTS_TABLE_CALORIES,
    PRODUCTS_TABLE_CARBOHYDRATES, PRODUCTS_TABLE_FATS, PRODUCTS_TABLE_GI, PRODUCTS_TABLE_GROUP,
    PRODUCTS_TABLE_NAME, PRODUCTS_TABLE_PROTEINS, PRODUCTS_TABLE_XE, USER_INFO_TABLE
} from './DataBaseConst';
import { IProduct } from './Models/Product';
import { IGroup } from './Models/ProductGroup';

const DbContext = () => {

    const d = SQLite.openDatabase('UserData.db');

    if(d){
        
    }
    return d;

}

export default DbContext;



