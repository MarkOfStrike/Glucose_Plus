import { USER_INFO_TABLE, GLUCOSE_MEASUREMENT_TABLE, FOOD_TABLE, PRODUCTS_TABLE, PRODUCT_GROUP_TABLE, FOOD_RECORD_TABLE, PRODUCT_GROUP_TABLE_NAME, PRODUCT_GROUP_TABLE_ID, PRODUCTS_TABLE_NAME, PRODUCTS_TABLE_GI, PRODUCTS_TABLE_XE, PRODUCTS_TABLE_FATS, PRODUCTS_TABLE_PROTEINS, PRODUCTS_TABLE_CARBOHYDRATES, PRODUCTS_TABLE_CALORIES, PRODUCTS_TABLE_GROUP, GLUCOSE_MEASUREMENT_TABLE_DATE_ADD } from '../../../DataBase/DataBaseConst';
import React from 'react';
import { IApplicationAction } from './../../StoreInterfaces';
import { HOME_SCREEN_LOADING_DATA } from "../../../constants/ActionsName";

import {WebSQLDatabase} from 'expo-sqlite';

import { IProduct } from '../../../DataBase/Models/Product';
import { IGroup } from '../../../DataBase/Models/ProductGroup';
import { Group } from '../AddProduct/Reducer';
import DbContext from '../../../DataBase/DataBase';
import { debug } from 'react-native-reanimated';
import { LogBox } from 'react-native';





export interface HomeScreenLoadingAction {
    type: typeof HOME_SCREEN_LOADING_DATA,
    isLoad: boolean
}


export type HomeScreenActions = HomeScreenLoadingAction

export const LoadSampleData = ():IApplicationAction<HomeScreenLoadingAction> => (dispatch, getState) => {


    dispatch({ type: HOME_SCREEN_LOADING_DATA, isLoad: true });

    const db = DbContext();


    // db.transaction(tr => {

    //     tr.executeSql(`select ${GLUCOSE_MEASUREMENT_TABLE_DATE_ADD} from ${GLUCOSE_MEASUREMENT_TABLE}`,[],(x,r) => {
    //         console.log(r);
            
    //     })

    // }, error => {

    // }, () => {

    // })

    // const tables:Array<string> = [
    //     USER_INFO_TABLE,
    //     GLUCOSE_MEASUREMENT_TABLE,
    //     FOOD_TABLE,
    //     PRODUCTS_TABLE,
    //     PRODUCT_GROUP_TABLE,
    //     FOOD_RECORD_TABLE
    // ]

    // db.transaction(tx => {

    //     tables.map((table, i) => {
    //         tx.executeSql(`DROP TABLE IF EXISTS ${table}`,[], (tr, result) => {
    //             console.log(`Таблица ${table} удалена`);
                
    //         })
    //     })

    // }, error => {
    //     console.log(error);
        
    // }, () => {
    //     console.log('Delete Ok');
        
    // })

    // const date = new Date();
    // const m = new Date();
    // if(date.getDay()){
    //     m.setDate(date.getDate() + 8 - date.getDay())
    // } else {
    //     m.setDate(date.getDate() + 1)
    // }

    // console.log($.format.date(new Date(),''));
    
    
    // const b = new Date(1622840399000);

    // for (let index = -10; index < 10; index++) {
        
    //     console.log(new Date(new Date(1622840399000).setDate(new Date(1622840399000).getDate() + index)));
        
        
    // }

    // console.log(b.getDate());
    

    // console.log(b);

    // const start = new Date(b.getFullYear(), b.getMonth(), b.getDay(), 0,0,0);
    // const finish = new Date(b.getFullYear(), b.getMonth(), b.getDay(), 23,59,59);

    // console.log(Date.parse(start.toString()), Date.parse(finish.toString()));
    // console.log(start.toTimeString());
    



    


    //VARCHAR(255)

    db.transaction(tx => {

        tx.executeSql('CREATE TABLE IF NOT EXISTS ProductGroups (Id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, Name VARCHAR(255));', []);
        tx.executeSql('CREATE TABLE IF NOT EXISTS UserInfo (Id INTEGER  NOT NULL PRIMARY KEY AUTOINCREMENT, Name VARCHAR(255), Surname VARCHAR(255), Weight DOUBLE, MaxLevelGlucose DOUBLE, MinLevelGlucose DOUBLE, Height DOUBLE, DateOfBirth VARCHAR(255), UserIdServer INTEGER);', []);
        tx.executeSql('CREATE TABLE IF NOT EXISTS GlucoseMeasurement (Id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, DateAdd INTEGER NOT NULL , Level DOUBLE NOT NULL);', []);
        tx.executeSql('CREATE TABLE IF NOT EXISTS Foods (Id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, Name VARCHAR(255), DateAdd VARCHAR(255), InsulineDose DOUBLE, CarbohydrateRatio DOUBLE);', []);
        tx.executeSql('CREATE TABLE IF NOT EXISTS Products (Id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, Name VARCHAR(255), GI DOUBLE, XE DOUBLE, Fats DOUBLE, Proteins DOUBLE, Carbohydrates DOUBLE, Calories INTEGER, ProductGroup_Id INTEGER NOT NULL, FOREIGN KEY(ProductGroup_Id) REFERENCES ProductGroups(Id) ON DELETE NO ACTION ON UPDATE NO ACTION);', []);
        tx.executeSql('CREATE INDEX IF NOT EXISTS Products_FKIndex1 ON Products (ProductGroup_Id);', []);
        tx.executeSql('CREATE TABLE IF NOT EXISTS FoodRecords (Product_Id INTEGER  NOT NULL, Food_Id INTEGER NOT NULL, NumbersOfGrams INTEGER NOT NULL, FOREIGN KEY(Food_Id) REFERENCES Foods(Id) ON DELETE CASCADE ON UPDATE CASCADE, FOREIGN KEY(Product_Id) REFERENCES Products(Id) ON DELETE CASCADE ON UPDATE CASCADE);', []);
        tx.executeSql('CREATE INDEX IF NOT EXISTS FoodRecords_FKIndex1 ON FoodRecords (Food_Id);', []);
        tx.executeSql('CREATE INDEX IF NOT EXISTS FoodRecords_FKIndex2 ON FoodRecords (Product_Id);', []);

    },error => {
        console.log(error);
    }, () => {
        console.log('Create table Ok');
    })

    const groups:Array<IGroup> = Object.values(Group).map((v,i) => {
        return { Name: v.toString() }
    })

    db.transaction(tr => {
        
        groups.map((group, i) => {

            const query = `INSERT INTO ${PRODUCT_GROUP_TABLE} (${PRODUCT_GROUP_TABLE_NAME}) SELECT \'${group.Name}\' WHERE NOT EXISTS (SELECT 1 FROM ${PRODUCT_GROUP_TABLE} WHERE ${PRODUCT_GROUP_TABLE_NAME} = \'${group.Name}\');`;

            tr.executeSql(query);
        })

    })

    const products: Array<IProduct> = [
        { Name: 'Бобы', Calories: 58, Proteins: 6, Fats: 0.1, Carbohydrates: 8.3, Gi: 0, Xe: 0.83, Group: { Name: 'Бобовые' } },
        { Name: 'Горох лущеный', Calories: 323, Proteins: 23, Fats: 1.6, Carbohydrates: 57.7, Gi: 0, Xe: 5.77, Group: { Name: 'Бобовые' } },
        { Name: 'Горох цельный', Calories: 303, Proteins: 23, Fats: 1.2, Carbohydrates: 53.3, Gi: 0, Xe: 5.33, Group: { Name: 'Бобовые' } },
        { Name: 'Соя', Calories: 395, Proteins: 34.9, Fats: 17.3, Carbohydrates: 26.5, Gi: 0, Xe: 2.65, Group: { Name: 'Бобовые' } },
        { Name: 'Фасоль', Calories: 309, Proteins: 22.3, Fats: 1.7, Carbohydrates: 54.5, Gi: 0, Xe: 5.45, Group: { Name: 'Бобовые' } },
        { Name: 'Чечевица', Calories: 310, Proteins: 24.8, Fats: 1.1, Carbohydrates: 53.7, Gi: 0, Xe: 5.37, Group: { Name: 'Бобовые' } },
        { Name: 'Белые свежие', Calories: 25, Proteins: 3.2, Fats: 0.7, Carbohydrates: 1.6, Gi: 0, Xe: 0.16, Group: { Name: 'Грибы' } },
        { Name: 'Белые сушеные', Calories: 209, Proteins: 27.6, Fats: 6.8, Carbohydrates: 10, Gi: 0, Xe: 1, Group: { Name: 'Грибы' } },
        { Name: 'Подберезовики свежие', Calories: 31, Proteins: 2.3, Fats: 0.9, Carbohydrates: 3.7, Gi: 0, Xe: 0.37, Group: { Name: 'Грибы' } },
        { Name: 'Подосиновики свежие', Calories: 31, Proteins: 3.3, Fats: 0.5, Carbohydrates: 3.4, Gi: 0, Xe: 0.34, Group: { Name: 'Грибы' } },
        { Name: 'Сыроежки свежие', Calories: 17, Proteins: 1.7, Fats: 0.3, Carbohydrates: 1.4, Gi: 0, Xe: 0.14, Group: { Name: 'Грибы' } },
        { Name: 'Жир топленый', Calories: 897, Proteins: 0, Fats: 99.7, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Жиры, маргарин, масло' } },
        { Name: 'Шпик свиной (без шкурки)', Calories: 816, Proteins: 1.4, Fats: 92.8, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Жиры, маргарин, масло' } },
        { Name: 'Маргарин молочный', Calories: 746, Proteins: 0.3, Fats: 82.3, Carbohydrates: 1, Gi: 0, Xe: 0.1, Group: { Name: 'Жиры, маргарин, масло' } },
        { Name: 'Маргарин бутербродный', Calories: 744, Proteins: 0.5, Fats: 82, Carbohydrates: 1.2, Gi: 0, Xe: 0.12, Group: { Name: 'Жиры, маргарин, масло' } },
        { Name: 'Майонез', Calories: 627, Proteins: 3.1, Fats: 67, Carbohydrates: 2.6, Gi: 0, Xe: 0.26, Group: { Name: 'Жиры, маргарин, масло' } },
        { Name: 'Масло растительное', Calories: 899, Proteins: 0, Fats: 99.9, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Жиры, маргарин, масло' } },
        { Name: 'Масло сливочное', Calories: 748, Proteins: 0.6, Fats: 82.5, Carbohydrates: 0.9, Gi: 0, Xe: 0.09, Group: { Name: 'Жиры, маргарин, масло' } },
        { Name: 'Масло топленое', Calories: 887, Proteins: 0.3, Fats: 98, Carbohydrates: 0.6, Gi: 0, Xe: 0.06, Group: { Name: 'Жиры, маргарин, масло' } },
        { Name: 'Кеты зернистая', Calories: 251, Proteins: 31.6, Fats: 13.8, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Икра' } },
        { Name: 'Лещевая пробойная', Calories: 142, Proteins: 24.7, Fats: 4.8, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Икра' } },
        { Name: 'Минтаевая пробойная', Calories: 131, Proteins: 28.4, Fats: 1.9, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Икра' } },
        { Name: 'Осетровая зернистая', Calories: 203, Proteins: 28.9, Fats: 9.7, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Икра' } },
        { Name: 'Осетровая пробойная', Calories: 123, Proteins: 36, Fats: 10.2, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Икра' } },
        { Name: 'Вареная колбаса Диабетическая', Calories: 254, Proteins: 12.1, Fats: 22.8, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Колбаса и колбасные изделия' } },
        { Name: 'Вареная колбаса Диетическая', Calories: 170, Proteins: 12.1, Fats: 13.5, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Колбаса и колбасные изделия' } },
        { Name: 'Вареная колбаса Докторская', Calories: 260, Proteins: 13.7, Fats: 22.8, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Колбаса и колбасные изделия' } },
        { Name: 'Вареная колбаса Любительская', Calories: 301, Proteins: 12.2, Fats: 28, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Колбаса и колбасные изделия' } },
        { Name: 'Вареная колбаса Молочная', Calories: 252, Proteins: 11.7, Fats: 22.8, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Колбаса и колбасные изделия' } },
        { Name: 'Вареная колбаса Отдельная', Calories: 228, Proteins: 10.1, Fats: 20.1, Carbohydrates: 1.8, Gi: 0, Xe: 0.18, Group: { Name: 'Колбаса и колбасные изделия' } },
        { Name: 'Вареная колбаса Телячья', Calories: 316, Proteins: 12.5, Fats: 29.6, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Колбаса и колбасные изделия' } },
        { Name: 'Сардельки Свиные', Calories: 332, Proteins: 10.1, Fats: 31.6, Carbohydrates: 1.9, Gi: 0, Xe: 0.19, Group: { Name: 'Колбаса и колбасные изделия' } },
        { Name: 'Сосиски Молочные', Calories: 277, Proteins: 12.3, Fats: 25.3, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Колбаса и колбасные изделия' } },
        { Name: 'Сосиски Русские', Calories: 220, Proteins: 12, Fats: 19.1, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Колбаса и колбасные изделия' } },
        { Name: 'Сосиски Свиные', Calories: 324, Proteins: 11.8, Fats: 30.8, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Колбаса и колбасные изделия' } },
        { Name: 'Варено-копченая Любительская', Calories: 420, Proteins: 17.3, Fats: 39, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Колбаса и колбасные изделия' } },
        { Name: 'Варено-копченая Сервелат', Calories: 360, Proteins: 28.2, Fats: 27.5, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Колбаса и колбасные изделия' } },
        { Name: 'Полукопченая Краковская', Calories: 466, Proteins: 16.2, Fats: 44.6, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Колбаса и колбасные изделия' } },
        { Name: 'Полукопченая Минская', Calories: 259, Proteins: 23, Fats: 17.4, Carbohydrates: 2.7, Gi: 0, Xe: 0.27, Group: { Name: 'Колбаса и колбасные изделия' } },
        { Name: 'Полукопченая Полтавская', Calories: 417, Proteins: 16.4, Fats: 39, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Колбаса и колбасные изделия' } },
        { Name: 'Полукопченая Украинская', Calories: 376, Proteins: 16.5, Fats: 34.4, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Колбаса и колбасные изделия' } },
        { Name: 'Сырокопченая Любительская', Calories: 514, Proteins: 20.9, Fats: 47.8, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Колбаса и колбасные изделия' } },
        { Name: 'Сырокопченая Московская', Calories: 473, Proteins: 24.8, Fats: 41.5, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Колбаса и колбасные изделия' } },
        { Name: 'Гречневая ядрица', Calories: 329, Proteins: 12.6, Fats: 2.6, Carbohydrates: 68, Gi: 0, Xe: 6.8, Group: { Name: 'Крупы' } },
        { Name: 'Гречневая продел', Calories: 326, Proteins: 9.5, Fats: 1.9, Carbohydrates: 72.2, Gi: 0, Xe: 7.22, Group: { Name: 'Крупы' } },
        { Name: 'Манная', Calories: 326, Proteins: 11.3, Fats: 0.7, Carbohydrates: 73.3, Gi: 0, Xe: 7.33, Group: { Name: 'Крупы' } },
        { Name: 'Овсяная', Calories: 345, Proteins: 11.9, Fats: 5.8, Carbohydrates: 65.4, Gi: 0, Xe: 6.54, Group: { Name: 'Крупы' } },
        { Name: 'Перловая', Calories: 324, Proteins: 9.3, Fats: 1.1, Carbohydrates: 73.7, Gi: 0, Xe: 7.37, Group: { Name: 'Крупы' } },
        { Name: 'Пшено', Calories: 334, Proteins: 12, Fats: 2.9, Carbohydrates: 69.3, Gi: 0, Xe: 6.93, Group: { Name: 'Крупы' } },
        { Name: 'Рисовая', Calories: 323, Proteins: 7, Fats: 0.6, Carbohydrates: 73.7, Gi: 0, Xe: 7.37, Group: { Name: 'Крупы' } },
        { Name: 'Пшеничная “Полтавская”', Calories: 325, Proteins: 12.7, Fats: 1.1, Carbohydrates: 70.6, Gi: 0, Xe: 7.06, Group: { Name: 'Крупы' } },
        { Name: 'Толокно', Calories: 357, Proteins: 12.2, Fats: 5.8, Carbohydrates: 68.3, Gi: 0, Xe: 6.83, Group: { Name: 'Крупы' } },
        { Name: 'Ячневая', Calories: 322, Proteins: 10.4, Fats: 1.3, Carbohydrates: 71.7, Gi: 0, Xe: 7.17, Group: { Name: 'Крупы' } },
        { Name: 'Геркулес', Calories: 355, Proteins: 13.1, Fats: 6.2, Carbohydrates: 65.7, Gi: 0, Xe: 6.57, Group: { Name: 'Крупы' } },
        { Name: 'Кукурузная', Calories: 325, Proteins: 8.3, Fats: 1.2, Carbohydrates: 75, Gi: 0, Xe: 7.5, Group: { Name: 'Крупы' } },
        { Name: 'Брынза из коровьего молока', Calories: 260, Proteins: 17.9, Fats: 20.1, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Молоко и молочные продукты' } },
        { Name: 'Йогурт нат. 1.5% жирности', Calories: 51, Proteins: 5, Fats: 1.5, Carbohydrates: 3.5, Gi: 0, Xe: 0.35, Group: { Name: 'Молоко и молочные продукты' } },
        { Name: 'Кефир нежирный', Calories: 30, Proteins: 3, Fats: 0.1, Carbohydrates: 3.8, Gi: 0, Xe: 0.38, Group: { Name: 'Молоко и молочные продукты' } },
        { Name: 'Кефир жирный', Calories: 59, Proteins: 2.8, Fats: 3.2, Carbohydrates: 4.1, Gi: 0, Xe: 0.41, Group: { Name: 'Молоко и молочные продукты' } },
        { Name: 'Молоко', Calories: 58, Proteins: 2.8, Fats: 3.2, Carbohydrates: 4.7, Gi: 0, Xe: 0.47, Group: { Name: 'Молоко и молочные продукты' } },
        { Name: 'Молоко ацидофильное', Calories: 83, Proteins: 2.8, Fats: 3.2, Carbohydrates: 10.8, Gi: 0, Xe: 1.08, Group: { Name: 'Молоко и молочные продукты' } },
        { Name: 'Молоко сухое цельное', Calories: 475, Proteins: 25.6, Fats: 25, Carbohydrates: 39.4, Gi: 0, Xe: 3.94, Group: { Name: 'Молоко и молочные продукты' } },
        { Name: 'Молоко сгущенное', Calories: 135, Proteins: 7, Fats: 7.9, Carbohydrates: 9.5, Gi: 0, Xe: 0.95, Group: { Name: 'Молоко и молочные продукты' } },
        { Name: 'Молоко сгущенное с сахаром', Calories: 315, Proteins: 7.2, Fats: 8.5, Carbohydrates: 56, Gi: 0, Xe: 5.6, Group: { Name: 'Молоко и молочные продукты' } },
        { Name: 'Простокваша', Calories: 58, Proteins: 2.8, Fats: 3.2, Carbohydrates: 4.1, Gi: 0, Xe: 0.41, Group: { Name: 'Молоко и молочные продукты' } },
        { Name: 'Ряженка', Calories: 85, Proteins: 3, Fats: 6, Carbohydrates: 4.1, Gi: 0, Xe: 0.41, Group: { Name: 'Молоко и молочные продукты' } },
        { Name: 'Сливки 10%', Calories: 118, Proteins: 3, Fats: 10, Carbohydrates: 4, Gi: 0, Xe: 0.4, Group: { Name: 'Молоко и молочные продукты' } },
        { Name: 'Сливки 20%', Calories: 205, Proteins: 2.8, Fats: 20, Carbohydrates: 3.6, Gi: 0, Xe: 0.36, Group: { Name: 'Молоко и молочные продукты' } },
        { Name: 'Сметана 10%', Calories: 116, Proteins: 3, Fats: 10, Carbohydrates: 2.9, Gi: 0, Xe: 0.29, Group: { Name: 'Молоко и молочные продукты' } },
        { Name: 'Сметана 20%', Calories: 206, Proteins: 2.8, Fats: 20, Carbohydrates: 3.2, Gi: 0, Xe: 0.32, Group: { Name: 'Молоко и молочные продукты' } },
        { Name: 'Сырки и масса творожные особые', Calories: 340, Proteins: 7.1, Fats: 23, Carbohydrates: 27.5, Gi: 0, Xe: 2.75, Group: { Name: 'Молоко и молочные продукты' } },
        { Name: 'Сыр российский', Calories: 371, Proteins: 23.4, Fats: 30, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Молоко и молочные продукты' } },
        { Name: 'Сыр голландский', Calories: 361, Proteins: 26.8, Fats: 27.3, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Молоко и молочные продукты' } },
        { Name: 'Сыр швейцарский', Calories: 396, Proteins: 24.9, Fats: 31.8, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Молоко и молочные продукты' } },
        { Name: 'Сыр пошехонский', Calories: 334, Proteins: 26, Fats: 26.5, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Молоко и молочные продукты' } },
        { Name: 'Сыр плавленный', Calories: 226, Proteins: 24, Fats: 13.5, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Молоко и молочные продукты' } },
        { Name: 'Творог жирный', Calories: 226, Proteins: 14, Fats: 18, Carbohydrates: 1.3, Gi: 0, Xe: 0.13, Group: { Name: 'Молоко и молочные продукты' } },
        { Name: 'Творог полужирный', Calories: 156, Proteins: 16.7, Fats: 9, Carbohydrates: 1.3, Gi: 0, Xe: 0.13, Group: { Name: 'Молоко и молочные продукты' } },
        { Name: 'Творог нежирный', Calories: 86, Proteins: 18, Fats: 0.6, Carbohydrates: 1.5, Gi: 0, Xe: 0.15, Group: { Name: 'Молоко и молочные продукты' } },
        { Name: 'Говядина тушеная', Calories: 232, Proteins: 16.8, Fats: 18.3, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Мясные консервы и копчености' } },
        { Name: 'Завтрак туриста (говядина)', Calories: 176, Proteins: 20.5, Fats: 10.4, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Мясные консервы и копчености' } },
        { Name: 'Завтрак туриста (свинина)', Calories: 206, Proteins: 16.9, Fats: 15.4, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Мясные консервы и копчености' } },
        { Name: 'Колбасный фарш', Calories: 213, Proteins: 15.2, Fats: 15.7, Carbohydrates: 2.8, Gi: 0, Xe: 0.28, Group: { Name: 'Мясные консервы и копчености' } },
        { Name: 'Свинина тушеная', Calories: 349, Proteins: 14.9, Fats: 32.2, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Мясные консервы и копчености' } },
        { Name: 'Грудинка сырокопченая', Calories: 632, Proteins: 7.6, Fats: 66.8, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Мясные консервы и копчености' } },
        { Name: 'Корейка сырокопченая', Calories: 467, Proteins: 10.5, Fats: 47.2, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Мясные консервы и копчености' } },
        { Name: 'Ветчина', Calories: 279, Proteins: 22.6, Fats: 20.9, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Мясные консервы и копчености' } },
        { Name: 'Баранина', Calories: 203, Proteins: 16.3, Fats: 15.3, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Мясо, субпродукты, птица' } },
        { Name: 'Говядина', Calories: 187, Proteins: 18.9, Fats: 12.4, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Мясо, субпродукты, птица' } },
        { Name: 'Конина', Calories: 143, Proteins: 20.2, Fats: 7, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Мясо, субпродукты, птица' } },
        { Name: 'Кролик', Calories: 199, Proteins: 20.7, Fats: 12.9, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Мясо, субпродукты, птица' } },
        { Name: 'Свинина нежирная', Calories: 316, Proteins: 16.4, Fats: 27.8, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Мясо, субпродукты, птица' } },
        { Name: 'Свинина жирная', Calories: 489, Proteins: 11.4, Fats: 49.3, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Мясо, субпродукты, птица' } },
        { Name: 'Телятина', Calories: 90, Proteins: 19.7, Fats: 1.2, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Мясо, субпродукты, птица' } },
        { Name: 'Бараньи Почки', Calories: 77, Proteins: 13.6, Fats: 2.5, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Мясо, субпродукты, птица' } },
        { Name: 'Баранья Печень', Calories: 101, Proteins: 18.7, Fats: 2.9, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Мясо, субпродукты, птица' } },
        { Name: 'Баранье Сердце', Calories: 82, Proteins: 13.5, Fats: 2.5, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Мясо, субпродукты, птица' } },
        { Name: 'Говяжьи Мозги', Calories: 124, Proteins: 9.5, Fats: 9.5, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Мясо, субпродукты, птица' } },
        { Name: 'Говяжья Печень', Calories: 98, Proteins: 17.4, Fats: 3.1, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Мясо, субпродукты, птица' } },
        { Name: 'Говяжьи Почки', Calories: 66, Proteins: 12.5, Fats: 1.8, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Мясо, субпродукты, птица' } },
        { Name: 'Говяжье Вымя', Calories: 173, Proteins: 12.3, Fats: 13.7, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Мясо, субпродукты, птица' } },
        { Name: 'Говяжье Сердце', Calories: 87, Proteins: 15, Fats: 3, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Мясо, субпродукты, птица' } },
        { Name: 'Говяжий Язык', Calories: 163, Proteins: 13.6, Fats: 12.1, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Мясо, субпродукты, птица' } },
        { Name: 'Почки свиные', Calories: 80, Proteins: 13, Fats: 3.1, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Мясо, субпродукты, птица' } },
        { Name: 'Печень свиная', Calories: 108, Proteins: 18.8, Fats: 3.6, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Мясо, субпродукты, птица' } },
        { Name: 'Сердце свиное', Calories: 89, Proteins: 15.1, Fats: 3.2, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Мясо, субпродукты, птица' } },
        { Name: 'Язык свиной', Calories: 208, Proteins: 14.2, Fats: 16.8, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Мясо, субпродукты, птица' } },
        { Name: 'Гуси', Calories: 364, Proteins: 16.1, Fats: 33.3, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Мясо, субпродукты, птица' } },
        { Name: 'Индейка', Calories: 197, Proteins: 21.6, Fats: 12, Carbohydrates: 0.8, Gi: 0, Xe: 0.08, Group: { Name: 'Мясо, субпродукты, птица' } },
        { Name: 'Куры', Calories: 165, Proteins: 20.8, Fats: 8.8, Carbohydrates: 0.6, Gi: 0, Xe: 0.06, Group: { Name: 'Мясо, субпродукты, птица' } },
        { Name: 'Цыплята', Calories: 156, Proteins: 18.7, Fats: 7.8, Carbohydrates: 0.4, Gi: 0, Xe: 0.04, Group: { Name: 'Мясо, субпродукты, птица' } },
        { Name: 'Утки', Calories: 346, Proteins: 16.5, Fats: 61.2, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Мясо, субпродукты, птица' } },
        { Name: 'Баклажаны', Calories: 24, Proteins: 0.6, Fats: 0.1, Carbohydrates: 5.5, Gi: 0, Xe: 0.55, Group: { Name: 'Овощи' } },
        { Name: 'Брюква', Calories: 37, Proteins: 1.2, Fats: 0.1, Carbohydrates: 8.1, Gi: 0, Xe: 0.81, Group: { Name: 'Овощи' } },
        { Name: 'Горошек зеленый', Calories: 72, Proteins: 5, Fats: 0.2, Carbohydrates: 13.3, Gi: 0, Xe: 1.33, Group: { Name: 'Овощи' } },
        { Name: 'Кабачки', Calories: 27, Proteins: 0.6, Fats: 0.3, Carbohydrates: 5.7, Gi: 0, Xe: 0.57, Group: { Name: 'Овощи' } },
        { Name: 'Капуста белокочанная', Calories: 28, Proteins: 1.8, Fats: 0, Carbohydrates: 5.4, Gi: 0, Xe: 0.54, Group: { Name: 'Овощи' } },
        { Name: 'Капуста краснокочанная', Calories: 31, Proteins: 1.8, Fats: 0, Carbohydrates: 6.1, Gi: 0, Xe: 0.61, Group: { Name: 'Овощи' } },
        { Name: 'Капуста цветная', Calories: 29, Proteins: 2.5, Fats: 0, Carbohydrates: 4.9, Gi: 0, Xe: 0.49, Group: { Name: 'Овощи' } },
        { Name: 'Картофель', Calories: 83, Proteins: 2, Fats: 0.1, Carbohydrates: 19.7, Gi: 0, Xe: 1.97, Group: { Name: 'Овощи' } },
        { Name: 'Лук зеленый (перо)', Calories: 22, Proteins: 1.3, Fats: 0, Carbohydrates: 4.3, Gi: 0, Xe: 0.43, Group: { Name: 'Овощи' } },
        { Name: 'Лук порей', Calories: 40, Proteins: 3, Fats: 0, Carbohydrates: 7.3, Gi: 0, Xe: 0.73, Group: { Name: 'Овощи' } },
        { Name: 'Лук репчатый', Calories: 43, Proteins: 1.7, Fats: 0, Carbohydrates: 9.5, Gi: 0, Xe: 0.95, Group: { Name: 'Овощи' } },
        { Name: 'Морковь красная', Calories: 33, Proteins: 1.3, Fats: 0.1, Carbohydrates: 7, Gi: 0, Xe: 0.7, Group: { Name: 'Овощи' } },
        { Name: 'Огурцы грунтовые', Calories: 15, Proteins: 0.8, Fats: 0, Carbohydrates: 3, Gi: 0, Xe: 0.3, Group: { Name: 'Овощи' } },
        { Name: 'Огурцы парниковые', Calories: 10, Proteins: 0.7, Fats: 0, Carbohydrates: 1.8, Gi: 0, Xe: 0.18, Group: { Name: 'Овощи' } },
        { Name: 'Перец зеленый сладкий', Calories: 23, Proteins: 1.3, Fats: 0, Carbohydrates: 4.7, Gi: 0, Xe: 0.47, Group: { Name: 'Овощи' } },
        { Name: 'Перец красный сладкий', Calories: 27, Proteins: 1.3, Fats: 0, Carbohydrates: 5.7, Gi: 0, Xe: 0.57, Group: { Name: 'Овощи' } },
        { Name: 'Петрушка (зелень)', Calories: 45, Proteins: 3.7, Fats: 0, Carbohydrates: 8.1, Gi: 0, Xe: 0.81, Group: { Name: 'Овощи' } },
        { Name: 'Петрушка (корень)', Calories: 47, Proteins: 1.5, Fats: 0, Carbohydrates: 11, Gi: 0, Xe: 1.1, Group: { Name: 'Овощи' } },
        { Name: 'Ревень (черешковый)', Calories: 16, Proteins: 0.7, Fats: 0, Carbohydrates: 2.9, Gi: 0, Xe: 0.29, Group: { Name: 'Овощи' } },
        { Name: 'Редис', Calories: 20, Proteins: 1.2, Fats: 0, Carbohydrates: 4.1, Gi: 0, Xe: 0.41, Group: { Name: 'Овощи' } },
        { Name: 'Редька', Calories: 34, Proteins: 1.9, Fats: 0, Carbohydrates: 7, Gi: 0, Xe: 0.7, Group: { Name: 'Овощи' } },
        { Name: 'Репа', Calories: 28, Proteins: 1.5, Fats: 0, Carbohydrates: 5.9, Gi: 0, Xe: 0.59, Group: { Name: 'Овощи' } },
        { Name: 'Салат', Calories: 14, Proteins: 1.5, Fats: 0, Carbohydrates: 2.2, Gi: 0, Xe: 0.22, Group: { Name: 'Овощи' } },
        { Name: 'Свекла', Calories: 48, Proteins: 1.7, Fats: 0, Carbohydrates: 10.8, Gi: 0, Xe: 1.08, Group: { Name: 'Овощи' } },
        { Name: 'Томаты (грунтовые)', Calories: 19, Proteins: 0.6, Fats: 0, Carbohydrates: 4.2, Gi: 0, Xe: 0.42, Group: { Name: 'Овощи' } },
        { Name: 'Томаты (парниковые)', Calories: 14, Proteins: 0.6, Fats: 0, Carbohydrates: 2.9, Gi: 0, Xe: 0.29, Group: { Name: 'Овощи' } },
        { Name: 'Зеленая фасоль', Calories: 32, Proteins: 4, Fats: 0, Carbohydrates: 4.3, Gi: 0, Xe: 0.43, Group: { Name: 'Овощи' } },
        { Name: 'Хрен', Calories: 71, Proteins: 2.5, Fats: 0, Carbohydrates: 16.3, Gi: 0, Xe: 1.63, Group: { Name: 'Овощи' } },
        { Name: 'Черемша', Calories: 34, Proteins: 2.4, Fats: 0, Carbohydrates: 6.5, Gi: 0, Xe: 0.65, Group: { Name: 'Овощи' } },
        { Name: 'Чеснок', Calories: 106, Proteins: 6.5, Fats: 0, Carbohydrates: 21.2, Gi: 0, Xe: 2.12, Group: { Name: 'Овощи' } },
        { Name: 'Шпинат', Calories: 21, Proteins: 2.9, Fats: 0, Carbohydrates: 2.3, Gi: 0, Xe: 0.23, Group: { Name: 'Овощи' } },
        { Name: 'Щавель', Calories: 28, Proteins: 1.5, Fats: 0, Carbohydrates: 5.3, Gi: 0, Xe: 0.53, Group: { Name: 'Овощи' } },
        { Name: 'Фундук', Calories: 704, Proteins: 16.1, Fats: 66.9, Carbohydrates: 9.9, Gi: 0, Xe: 0.99, Group: { Name: 'Орехи' } },
        { Name: 'Миндаль', Calories: 645, Proteins: 18.6, Fats: 57.7, Carbohydrates: 13.6, Gi: 0, Xe: 1.36, Group: { Name: 'Орехи' } },
        { Name: 'Грецкий орех', Calories: 648, Proteins: 13.8, Fats: 61.3, Carbohydrates: 10.2, Gi: 0, Xe: 1.02, Group: { Name: 'Орехи' } },
        { Name: 'Арахис', Calories: 548, Proteins: 26.3, Fats: 45.2, Carbohydrates: 9.7, Gi: 0, Xe: 0.97, Group: { Name: 'Орехи' } },
        { Name: 'Семя подсолнечника', Calories: 578, Proteins: 20.7, Fats: 52.9, Carbohydrates: 5, Gi: 0, Xe: 0.5, Group: { Name: 'Орехи' } },
        { Name: 'Бычки', Calories: 145, Proteins: 12.8, Fats: 8.1, Carbohydrates: 5.2, Gi: 0, Xe: 0.52, Group: { Name: 'Рыба и морепродукты' } },
        { Name: 'Горбуша', Calories: 147, Proteins: 21, Fats: 7, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Рыба и морепродукты' } },
        { Name: 'Камбала', Calories: 88, Proteins: 16.1, Fats: 2.6, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Рыба и морепродукты' } },
        { Name: 'Карась', Calories: 87, Proteins: 17.7, Fats: 1.8, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Рыба и морепродукты' } },
        { Name: 'Карп', Calories: 96, Proteins: 16, Fats: 3.6, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Рыба и морепродукты' } },
        { Name: 'Кета', Calories: 138, Proteins: 22, Fats: 5.6, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Рыба и морепродукты' } },
        { Name: 'Корюшка', Calories: 91, Proteins: 15.5, Fats: 3.2, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Рыба и морепродукты' } },
        { Name: 'Ледяная', Calories: 75, Proteins: 15.5, Fats: 1.4, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Рыба и морепродукты' } },
        { Name: 'Лещ', Calories: 105, Proteins: 17.1, Fats: 4.1, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Рыба и морепродукты' } },
        { Name: 'Семга', Calories: 219, Proteins: 20.8, Fats: 15.1, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Рыба и морепродукты' } },
        { Name: 'Макрурус', Calories: 60, Proteins: 13.2, Fats: 0.8, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Рыба и морепродукты' } },
        { Name: 'Минога', Calories: 166, Proteins: 14.7, Fats: 11.9, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Рыба и морепродукты' } },
        { Name: 'Минтай', Calories: 70, Proteins: 15.9, Fats: 0.7, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Рыба и морепродукты' } },
        { Name: 'Мойва', Calories: 157, Proteins: 13.4, Fats: 11.5, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Рыба и морепродукты' } },
        { Name: 'Навага', Calories: 73, Proteins: 16.1, Fats: 1, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Рыба и морепродукты' } },
        { Name: 'Налим', Calories: 81, Proteins: 18.8, Fats: 0.6, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Рыба и морепродукты' } },
        { Name: 'Нототения мраморная', Calories: 156, Proteins: 14.8, Fats: 10.7, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Рыба и морепродукты' } },
        { Name: 'Окунь морской', Calories: 117, Proteins: 17.6, Fats: 5.2, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Рыба и морепродукты' } },
        { Name: 'Окунь речной', Calories: 82, Proteins: 18.5, Fats: 0.9, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Рыба и морепродукты' } },
        { Name: 'Осетр', Calories: 164, Proteins: 16.4, Fats: 10.9, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Рыба и морепродукты' } },
        { Name: 'Палтус', Calories: 103, Proteins: 18.9, Fats: 3, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Рыба и морепродукты' } },
        { Name: 'Путассу', Calories: 72, Proteins: 16.1, Fats: 0.9, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Рыба и морепродукты' } },
        { Name: 'Рыба-сабля', Calories: 110, Proteins: 20.3, Fats: 3.2, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Рыба и морепродукты' } },
        { Name: 'Рыбец каспийский', Calories: 98, Proteins: 19.2, Fats: 2.4, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Рыба и морепродукты' } },
        { Name: 'Сазан', Calories: 121, Proteins: 18.4, Fats: 5.3, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Рыба и морепродукты' } },
        { Name: 'Сайра крупная', Calories: 262, Proteins: 18.6, Fats: 20.8, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Рыба и морепродукты' } },
        { Name: 'Сайра мелкая', Calories: 143, Proteins: 20.4, Fats: 0.8, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Рыба и морепродукты' } },
        { Name: 'Салака', Calories: 121, Proteins: 17.3, Fats: 5.6, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Рыба и морепродукты' } },
        { Name: 'Сельдь', Calories: 242, Proteins: 17.7, Fats: 19.5, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Рыба и морепродукты' } },
        { Name: 'Сиг', Calories: 144, Proteins: 19, Fats: 7.5, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Рыба и морепродукты' } },
        { Name: 'Скумбрия', Calories: 153, Proteins: 18, Fats: 9, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Рыба и морепродукты' } },
        { Name: 'Сом', Calories: 144, Proteins: 16.8, Fats: 8.5, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Рыба и морепродукты' } },
        { Name: 'Ставрида', Calories: 119, Proteins: 18.5, Fats: 5, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Рыба и морепродукты' } },
        { Name: 'Стерлядь', Calories: 320, Proteins: 17, Fats: 6.1, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Рыба и морепродукты' } },
        { Name: 'Судак', Calories: 83, Proteins: 19, Fats: 0.8, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Рыба и морепродукты' } },
        { Name: 'Треска', Calories: 75, Proteins: 17.5, Fats: 0.6, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Рыба и морепродукты' } },
        { Name: 'Тунец', Calories: 96, Proteins: 22.7, Fats: 0.7, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Рыба и морепродукты' } },
        { Name: 'Угольная рыба', Calories: 158, Proteins: 13.2, Fats: 11.6, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Рыба и морепродукты' } },
        { Name: 'Угорь морской', Calories: 94, Proteins: 19.1, Fats: 1.9, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Рыба и морепродукты' } },
        { Name: 'Угорь', Calories: 333, Proteins: 14.5, Fats: 30.5, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Рыба и морепродукты' } },
        { Name: 'Хек', Calories: 86, Proteins: 16.6, Fats: 2.2, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Рыба и морепродукты' } },
        { Name: 'Щука', Calories: 82, Proteins: 18.8, Fats: 0.7, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Рыба и морепродукты' } },
        { Name: 'Язь', Calories: 117, Proteins: 18.2, Fats: 0.3, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Рыба и морепродукты' } },
        { Name: 'Креветка дальневосточная', Calories: 134, Proteins: 28.7, Fats: 1.2, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Рыба и морепродукты' } },
        { Name: 'Печень трески', Calories: 613, Proteins: 4.2, Fats: 65.7, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Рыба и морепродукты' } },
        { Name: 'Кальмар', Calories: 75, Proteins: 18, Fats: 0.3, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Рыба и морепродукты' } },
        { Name: 'Краб', Calories: 69, Proteins: 16, Fats: 0.5, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Рыба и морепродукты' } },
        { Name: 'Креветка', Calories: 83, Proteins: 18, Fats: 0.8, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Рыба и морепродукты' } },
        { Name: 'Морская капуста', Calories: 5, Proteins: 0.9, Fats: 0.2, Carbohydrates: 3, Gi: 0, Xe: 0.3, Group: { Name: 'Рыба и морепродукты' } },
        { Name: 'Паста “Океан”', Calories: 137, Proteins: 18.9, Fats: 6.8, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Рыба и морепродукты' } },
        { Name: 'Трепанг', Calories: 35, Proteins: 7.3, Fats: 0.6, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Рыба и морепродукты' } },
        { Name: 'Мед', Calories: 308, Proteins: 0.8, Fats: 0, Carbohydrates: 80.3, Gi: 0, Xe: 8.03, Group: { Name: 'Сладости' } },
        { Name: 'Драже фруктовое', Calories: 384, Proteins: 3.7, Fats: 10.2, Carbohydrates: 73.1, Gi: 0, Xe: 7.31, Group: { Name: 'Сладости' } },
        { Name: 'Зефир', Calories: 299, Proteins: 0.8, Fats: 0, Carbohydrates: 78.3, Gi: 0, Xe: 7.83, Group: { Name: 'Сладости' } },
        { Name: 'Ирис', Calories: 387, Proteins: 3.3, Fats: 7.5, Carbohydrates: 81.8, Gi: 0, Xe: 8.18, Group: { Name: 'Сладости' } },
        { Name: 'Мармелад', Calories: 296, Proteins: 0, Fats: 0.1, Carbohydrates: 77.7, Gi: 0, Xe: 7.77, Group: { Name: 'Сладости' } },
        { Name: 'Карамель', Calories: 296, Proteins: 0, Fats: 0.1, Carbohydrates: 77.7, Gi: 0, Xe: 7.77, Group: { Name: 'Сладости' } },
        { Name: 'Конфеты. глаз-ые шоколадом', Calories: 396, Proteins: 2.9, Fats: 10.7, Carbohydrates: 76.6, Gi: 0, Xe: 7.66, Group: { Name: 'Сладости' } },
        { Name: 'Пастила', Calories: 305, Proteins: 0.5, Fats: 0, Carbohydrates: 80.4, Gi: 0, Xe: 8.04, Group: { Name: 'Сладости' } },
        { Name: 'Сахар', Calories: 374, Proteins: 0.3, Fats: 0, Carbohydrates: 99.5, Gi: 0, Xe: 9.95, Group: { Name: 'Сладости' } },
        { Name: 'Халва тахинная', Calories: 510, Proteins: 12.7, Fats: 29.9, Carbohydrates: 50.6, Gi: 0, Xe: 5.06, Group: { Name: 'Сладости' } },
        { Name: 'Халва подсолнечная', Calories: 516, Proteins: 11.6, Fats: 29.7, Carbohydrates: 54, Gi: 0, Xe: 5.4, Group: { Name: 'Сладости' } },
        { Name: 'Шоколад темный', Calories: 540, Proteins: 5.4, Fats: 35.3, Carbohydrates: 52.6, Gi: 0, Xe: 5.26, Group: { Name: 'Сладости' } },
        { Name: 'Шоколад молочный', Calories: 547, Proteins: 6.9, Fats: 35.7, Carbohydrates: 52.4, Gi: 0, Xe: 5.24, Group: { Name: 'Сладости' } },
        { Name: 'Вафли с фр-ми начинками', Calories: 342, Proteins: 3.2, Fats: 2.8, Carbohydrates: 80.1, Gi: 0, Xe: 8.01, Group: { Name: 'Сладости' } },
        { Name: 'Вафли с жировыми начинками', Calories: 530, Proteins: 3.4, Fats: 30.2, Carbohydrates: 64.7, Gi: 0, Xe: 6.47, Group: { Name: 'Сладости' } },
        { Name: 'Пирожное слоеное с кремом', Calories: 544, Proteins: 5.4, Fats: 38.6, Carbohydrates: 46.4, Gi: 0, Xe: 4.64, Group: { Name: 'Сладости' } },
        { Name: 'Пирожное слоеное с яблоком', Calories: 454, Proteins: 5.7, Fats: 25.6, Carbohydrates: 52.7, Gi: 0, Xe: 5.27, Group: { Name: 'Сладости' } },
        { Name: 'Пирожное бисквитное', Calories: 344, Proteins: 4.7, Fats: 9.3, Carbohydrates: 84.4, Gi: 0, Xe: 8.44, Group: { Name: 'Сладости' } },
        { Name: 'Пряники', Calories: 336, Proteins: 4.8, Fats: 2.8, Carbohydrates: 77.7, Gi: 0, Xe: 7.77, Group: { Name: 'Сладости' } },
        { Name: 'Торт бисквитный', Calories: 386, Proteins: 4.7, Fats: 20, Carbohydrates: 49.8, Gi: 0, Xe: 4.98, Group: { Name: 'Сладости' } },
        { Name: 'Торт миндальный', Calories: 524, Proteins: 6.6, Fats: 35.8, Carbohydrates: 46.8, Gi: 0, Xe: 4.68, Group: { Name: 'Сладости' } },
        { Name: 'Урюк', Calories: 278, Proteins: 5, Fats: 0, Carbohydrates: 67.5, Gi: 0, Xe: 6.75, Group: { Name: 'Сухофрукты' } },
        { Name: 'Курага', Calories: 272, Proteins: 5.2, Fats: 0, Carbohydrates: 65.9, Gi: 0, Xe: 6.59, Group: { Name: 'Сухофрукты' } },
        { Name: 'Изюм с косточкой', Calories: 276, Proteins: 1.8, Fats: 0, Carbohydrates: 70.9, Gi: 0, Xe: 7.09, Group: { Name: 'Сухофрукты' } },
        { Name: 'Изюм кишмиш', Calories: 279, Proteins: 2.3, Fats: 0, Carbohydrates: 71.2, Gi: 0, Xe: 7.12, Group: { Name: 'Сухофрукты' } },
        { Name: 'Вишня', Calories: 292, Proteins: 1.5, Fats: 0, Carbohydrates: 73, Gi: 0, Xe: 7.3, Group: { Name: 'Сухофрукты' } },
        { Name: 'Груша', Calories: 246, Proteins: 2.3, Fats: 0, Carbohydrates: 62.1, Gi: 0, Xe: 6.21, Group: { Name: 'Сухофрукты' } },
        { Name: 'Персики', Calories: 275, Proteins: 3, Fats: 0, Carbohydrates: 68.5, Gi: 0, Xe: 6.85, Group: { Name: 'Сухофрукты' } },
        { Name: 'Чернослив', Calories: 264, Proteins: 2.3, Fats: 0, Carbohydrates: 65.6, Gi: 0, Xe: 6.56, Group: { Name: 'Сухофрукты' } },
        { Name: 'Яблоки', Calories: 273, Proteins: 3.2, Fats: 0, Carbohydrates: 68, Gi: 0, Xe: 6.8, Group: { Name: 'Сухофрукты' } },
        { Name: 'Абрикосы', Calories: 46, Proteins: 0.9, Fats: 0, Carbohydrates: 10.5, Gi: 0, Xe: 1.05, Group: { Name: 'Фрукты и ягоды' } },
        { Name: 'Айва', Calories: 38, Proteins: 0.6, Fats: 0, Carbohydrates: 8.9, Gi: 0, Xe: 0.89, Group: { Name: 'Фрукты и ягоды' } },
        { Name: 'Алыча', Calories: 34, Proteins: 0.2, Fats: 0, Carbohydrates: 7.4, Gi: 0, Xe: 0.74, Group: { Name: 'Фрукты и ягоды' } },
        { Name: 'Ананас', Calories: 48, Proteins: 0.4, Fats: 0, Carbohydrates: 11.8, Gi: 0, Xe: 1.18, Group: { Name: 'Фрукты и ягоды' } },
        { Name: 'Бананы', Calories: 91, Proteins: 1.5, Fats: 0, Carbohydrates: 22.4, Gi: 0, Xe: 2.24, Group: { Name: 'Фрукты и ягоды' } },
        { Name: 'Вишня', Calories: 49, Proteins: 0.8, Fats: 0, Carbohydrates: 11.3, Gi: 0, Xe: 1.13, Group: { Name: 'Фрукты и ягоды' } },
        { Name: 'Гранат', Calories: 52, Proteins: 0.9, Fats: 0, Carbohydrates: 11.8, Gi: 0, Xe: 1.18, Group: { Name: 'Фрукты и ягоды' } },
        { Name: 'Груша', Calories: 42, Proteins: 0.4, Fats: 0, Carbohydrates: 10.7, Gi: 0, Xe: 1.07, Group: { Name: 'Фрукты и ягоды' } },
        { Name: 'Инжир', Calories: 56, Proteins: 0.7, Fats: 0, Carbohydrates: 13.9, Gi: 0, Xe: 1.39, Group: { Name: 'Фрукты и ягоды' } },
        { Name: 'Кизил', Calories: 45, Proteins: 1, Fats: 0, Carbohydrates: 9.7, Gi: 0, Xe: 0.97, Group: { Name: 'Фрукты и ягоды' } },
        { Name: 'Персики', Calories: 44, Proteins: 0.9, Fats: 0, Carbohydrates: 10.4, Gi: 0, Xe: 1.04, Group: { Name: 'Фрукты и ягоды' } },
        { Name: 'Рябина садовая', Calories: 58, Proteins: 1.4, Fats: 0, Carbohydrates: 12.5, Gi: 0, Xe: 1.25, Group: { Name: 'Фрукты и ягоды' } },
        { Name: 'Рябина черноплодная', Calories: 54, Proteins: 1.5, Fats: 0, Carbohydrates: 12, Gi: 0, Xe: 1.2, Group: { Name: 'Фрукты и ягоды' } },
        { Name: 'Слива садовая', Calories: 43, Proteins: 0.8, Fats: 0, Carbohydrates: 9.9, Gi: 0, Xe: 0.99, Group: { Name: 'Фрукты и ягоды' } },
        { Name: 'Финики', Calories: 281, Proteins: 2.5, Fats: 0, Carbohydrates: 72.1, Gi: 0, Xe: 7.21, Group: { Name: 'Фрукты и ягоды' } },
        { Name: 'Хурма', Calories: 62, Proteins: 0.5, Fats: 0, Carbohydrates: 15.9, Gi: 0, Xe: 1.59, Group: { Name: 'Фрукты и ягоды' } },
        { Name: 'Черешня', Calories: 52, Proteins: 1.1, Fats: 0, Carbohydrates: 12.3, Gi: 0, Xe: 1.23, Group: { Name: 'Фрукты и ягоды' } },
        { Name: 'Шелковица', Calories: 53, Proteins: 0.7, Fats: 0, Carbohydrates: 12.7, Gi: 0, Xe: 1.27, Group: { Name: 'Фрукты и ягоды' } },
        { Name: 'Яблоки', Calories: 46, Proteins: 0.4, Fats: 0, Carbohydrates: 11.3, Gi: 0, Xe: 1.13, Group: { Name: 'Фрукты и ягоды' } },
        { Name: 'Апельсин', Calories: 38, Proteins: 0.9, Fats: 0, Carbohydrates: 8.4, Gi: 0, Xe: 0.84, Group: { Name: 'Фрукты и ягоды' } },
        { Name: 'Грейпфрут', Calories: 35, Proteins: 0.9, Fats: 0, Carbohydrates: 7.3, Gi: 0, Xe: 0.73, Group: { Name: 'Фрукты и ягоды' } },
        { Name: 'Лимон', Calories: 31, Proteins: 0.9, Fats: 0, Carbohydrates: 3.6, Gi: 0, Xe: 0.36, Group: { Name: 'Фрукты и ягоды' } },
        { Name: 'Мандарин', Calories: 38, Proteins: 0.8, Fats: 0, Carbohydrates: 8.6, Gi: 0, Xe: 0.86, Group: { Name: 'Фрукты и ягоды' } },
        { Name: 'Брусника', Calories: 40, Proteins: 0.7, Fats: 0, Carbohydrates: 8.6, Gi: 0, Xe: 0.86, Group: { Name: 'Фрукты и ягоды' } },
        { Name: 'Виноград', Calories: 69, Proteins: 0.4, Fats: 0, Carbohydrates: 17.5, Gi: 0, Xe: 1.75, Group: { Name: 'Фрукты и ягоды' } },
        { Name: 'Голубика', Calories: 37, Proteins: 1, Fats: 0, Carbohydrates: 7.7, Gi: 0, Xe: 0.77, Group: { Name: 'Фрукты и ягоды' } },
        { Name: 'Ежевика', Calories: 33, Proteins: 2, Fats: 0, Carbohydrates: 5.3, Gi: 0, Xe: 0.53, Group: { Name: 'Фрукты и ягоды' } },
        { Name: 'Земляника', Calories: 41, Proteins: 1.8, Fats: 0, Carbohydrates: 8.1, Gi: 0, Xe: 0.81, Group: { Name: 'Фрукты и ягоды' } },
        { Name: 'Клюква', Calories: 28, Proteins: 0.5, Fats: 0, Carbohydrates: 4.8, Gi: 0, Xe: 0.48, Group: { Name: 'Фрукты и ягоды' } },
        { Name: 'Крыжовник', Calories: 44, Proteins: 0.7, Fats: 0, Carbohydrates: 9.9, Gi: 0, Xe: 0.99, Group: { Name: 'Фрукты и ягоды' } },
        { Name: 'Малина', Calories: 41, Proteins: 0.8, Fats: 0, Carbohydrates: 9, Gi: 0, Xe: 0.9, Group: { Name: 'Фрукты и ягоды' } },
        { Name: 'Морошка', Calories: 31, Proteins: 0.8, Fats: 0, Carbohydrates: 6.8, Gi: 0, Xe: 0.68, Group: { Name: 'Фрукты и ягоды' } },
        { Name: 'Облепиха', Calories: 30, Proteins: 0.9, Fats: 0, Carbohydrates: 5.5, Gi: 0, Xe: 0.55, Group: { Name: 'Фрукты и ягоды' } },
        { Name: 'Смородина белая', Calories: 39, Proteins: 0.3, Fats: 0, Carbohydrates: 8.7, Gi: 0, Xe: 0.87, Group: { Name: 'Фрукты и ягоды' } },
        { Name: 'Смородина красная', Calories: 38, Proteins: 0.6, Fats: 0, Carbohydrates: 8, Gi: 0, Xe: 0.8, Group: { Name: 'Фрукты и ягоды' } },
        { Name: 'Смородина черная', Calories: 40, Proteins: 1, Fats: 0, Carbohydrates: 8, Gi: 0, Xe: 0.8, Group: { Name: 'Фрукты и ягоды' } },
        { Name: 'Черника', Calories: 40, Proteins: 1.1, Fats: 0, Carbohydrates: 8.6, Gi: 0, Xe: 0.86, Group: { Name: 'Фрукты и ягоды' } },
        { Name: 'Шиповник свежий', Calories: 101, Proteins: 1.6, Fats: 0, Carbohydrates: 24, Gi: 0, Xe: 2.4, Group: { Name: 'Фрукты и ягоды' } },
        { Name: 'Шиповник сушеный', Calories: 253, Proteins: 4, Fats: 0, Carbohydrates: 60, Gi: 0, Xe: 6, Group: { Name: 'Фрукты и ягоды' } },
        { Name: 'Хлеб ржаной', Calories: 214, Proteins: 4.7, Fats: 0.7, Carbohydrates: 49.8, Gi: 0, Xe: 4.98, Group: { Name: 'Хлеб, хлебобулочные изделия, мука' } },
        { Name: 'Хлеб пшен. из муки I сорта', Calories: 254, Proteins: 7.7, Fats: 2.4, Carbohydrates: 53.4, Gi: 0, Xe: 5.34, Group: { Name: 'Хлеб, хлебобулочные изделия, мука' } },
        { Name: 'Сдобная выпечка', Calories: 297, Proteins: 7.6, Fats: 4.5, Carbohydrates: 60, Gi: 0, Xe: 6, Group: { Name: 'Хлеб, хлебобулочные изделия, мука' } },
        { Name: 'Баранки', Calories: 312, Proteins: 10.4, Fats: 1.3, Carbohydrates: 68.7, Gi: 0, Xe: 6.87, Group: { Name: 'Хлеб, хлебобулочные изделия, мука' } },
        { Name: 'Сушки', Calories: 330, Proteins: 11, Fats: 1.3, Carbohydrates: 73, Gi: 0, Xe: 7.3, Group: { Name: 'Хлеб, хлебобулочные изделия, мука' } },
        { Name: 'Сухари пшеничные', Calories: 331, Proteins: 11.2, Fats: 1.4, Carbohydrates: 72.4, Gi: 0, Xe: 7.24, Group: { Name: 'Хлеб, хлебобулочные изделия, мука' } },
        { Name: 'Сухари сливочные', Calories: 397, Proteins: 8.5, Fats: 10.6, Carbohydrates: 71.3, Gi: 0, Xe: 7.13, Group: { Name: 'Хлеб, хлебобулочные изделия, мука' } },
        { Name: 'Мука пшеничная высш. сорта', Calories: 327, Proteins: 10.3, Fats: 0.9, Carbohydrates: 74.2, Gi: 0, Xe: 7.42, Group: { Name: 'Хлеб, хлебобулочные изделия, мука' } },
        { Name: 'Мука пшеничная I сорта', Calories: 329, Proteins: 10.6, Fats: 1.3, Carbohydrates: 73.2, Gi: 0, Xe: 7.32, Group: { Name: 'Хлеб, хлебобулочные изделия, мука' } },
        { Name: 'Мука пшеничная II сорта', Calories: 328, Proteins: 11.7, Fats: 1.8, Carbohydrates: 70.8, Gi: 0, Xe: 7.08, Group: { Name: 'Хлеб, хлебобулочные изделия, мука' } },
        { Name: 'Мука ржаная', Calories: 326, Proteins: 6.9, Fats: 1.1, Carbohydrates: 76.9, Gi: 0, Xe: 7.69, Group: { Name: 'Хлеб, хлебобулочные изделия, мука' } },
        { Name: 'Яйцо куриное', Calories: 157, Proteins: 12.7, Fats: 11.5, Carbohydrates: 0.7, Gi: 0, Xe: 0.07, Group: { Name: 'Яйца' } },
        { Name: 'Яичный порошок', Calories: 542, Proteins: 45, Fats: 37.3, Carbohydrates: 7.1, Gi: 0, Xe: 0.71, Group: { Name: 'Яйца' } },
        { Name: 'Сухой белок', Calories: 336, Proteins: 73.3, Fats: 1.8, Carbohydrates: 7, Gi: 0, Xe: 0.7, Group: { Name: 'Яйца' } },
        { Name: 'Сухой желток', Calories: 623, Proteins: 34.2, Fats: 52.2, Carbohydrates: 4.4, Gi: 0, Xe: 0.44, Group: { Name: 'Яйца' } },
        { Name: 'Яйцо перепелиное', Calories: 168, Proteins: 11.9, Fats: 13.1, Carbohydrates: 0.6, Gi: 0, Xe: 0.06, Group: { Name: 'Яйца' } },

    ]

    db.transaction(tr => {

        products.map((product, i) => {
            const groupQuery = `(select ${PRODUCT_GROUP_TABLE_ID} from ${PRODUCT_GROUP_TABLE} where ${PRODUCT_GROUP_TABLE_NAME} = \'${product.Group?.Name}\')`

            const existsQuery = `(select 1 from ${PRODUCTS_TABLE} where ` + 
                `${PRODUCTS_TABLE_NAME} = \'${product.Name}\' and `+
                `${PRODUCTS_TABLE_GI} = ${product.Gi} and `+
                `${PRODUCTS_TABLE_XE} = ${product.Xe} and `+
                `${PRODUCTS_TABLE_FATS} = ${product.Fats} and `+
                `${PRODUCTS_TABLE_PROTEINS} = ${product.Proteins} and `+
                `${PRODUCTS_TABLE_CARBOHYDRATES} = ${product.Carbohydrates} and `+
                `${PRODUCTS_TABLE_CALORIES} = ${product.Calories} and `+
                `${PRODUCTS_TABLE_GROUP} = ${groupQuery})`;

            const selectQuery = `select \'${product.Name}\', ${product.Gi}, ${product.Xe}, ${product.Fats}, ${product.Proteins}, ${product.Carbohydrates}, ${product.Calories}, ${groupQuery} where not exists ${existsQuery}`

            const sourceQuery = `insert into ${PRODUCTS_TABLE} (` +
                `${PRODUCTS_TABLE_NAME}, `+
                `${PRODUCTS_TABLE_GI}, `+
                `${PRODUCTS_TABLE_XE}, `+
                `${PRODUCTS_TABLE_FATS}, `+
                `${PRODUCTS_TABLE_PROTEINS}, `+
                `${PRODUCTS_TABLE_CARBOHYDRATES}, `+
                `${PRODUCTS_TABLE_CALORIES}, `+
                `${PRODUCTS_TABLE_GROUP}`+
                `) ${selectQuery}`;


            
            tr.executeSql(sourceQuery, [], (t,r) => {
                // console.log(r.insertId);
                
            });

        })

    }, error => {console.log(error);
    }, () => {
        dispatch({ type: HOME_SCREEN_LOADING_DATA, isLoad: false });
    })

    // const del = DeleteAllTable(db)
    // const create = CreateNotExistsTable(db)
    // const data = SampleData(db);

    // Promise.all([del,create,data]).then(()=> {
    //     dispatch({ type: HOME_SCREEN_LOADING_DATA, isLoad: false });
    // });

    

}

const DeleteAllTable = (db:WebSQLDatabase) => {

    const tables:Array<string> = [
        USER_INFO_TABLE,
        GLUCOSE_MEASUREMENT_TABLE,
        FOOD_TABLE,
        PRODUCTS_TABLE,
        PRODUCT_GROUP_TABLE,
        FOOD_RECORD_TABLE
    ]

    db.transaction(tx => {

        tables.map((table, i) => {
            tx.executeSql(`DROP TABLE ${table}`,[], (tr, result) => {
                console.log(`Таблица ${table} удалена`);
                
            })
        })

    }, error => {
        console.log(error);
        
    }, () => {
        console.log('Delete Ok');
        
    })

}

const CreateNotExistsTable = (db:WebSQLDatabase) => {

    db.transaction(tx => {

        tx.executeSql('CREATE TABLE IF NOT EXISTS ProductGroups (Id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, Name VARCHAR(255));', []);
        tx.executeSql('CREATE TABLE IF NOT EXISTS UserInfo (Id INTEGER  NOT NULL PRIMARY KEY AUTOINCREMENT, Name VARCHAR(255), Surname VARCHAR(255), Weight DOUBLE, MaxLevelGlucose DOUBLE, MinLevelGlucose DOUBLE, Height DOUBLE, DateOfBirth VARCHAR(255), UserIdServer INTEGER);', []);
        tx.executeSql('CREATE TABLE IF NOT EXISTS GlucoseMeasurement (Id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, DateAdd VARCHAR(255) NOT NULL , Level DOUBLE NOT NULL);', []);
        tx.executeSql('CREATE TABLE IF NOT EXISTS Foods (Id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, Name VARCHAR(255), DateAdd VARCHAR(255));', []);
        tx.executeSql('CREATE TABLE IF NOT EXISTS Products (Id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, Name VARCHAR(255), GI DOUBLE, XE DOUBLE, Fats DOUBLE, Proteins DOUBLE, Carbohydrates DOUBLE, Calories INTEGER, ProductGroup_Id INTEGER NOT NULL, FOREIGN KEY(ProductGroup_Id) REFERENCES ProductGroups(Id) ON DELETE NO ACTION ON UPDATE NO ACTION);', []);
        tx.executeSql('CREATE INDEX IF NOT EXISTS Products_FKIndex1 ON Products (ProductGroup_Id);', []);
        tx.executeSql('CREATE TABLE IF NOT EXISTS FoodRecords (Product_Id INTEGER  NOT NULL, Food_Id INTEGER NOT NULL, NumbersOfGrams INTEGER NOT NULL, FOREIGN KEY(Food_Id) REFERENCES Foods(Id) ON DELETE CASCADE ON UPDATE CASCADE, FOREIGN KEY(Product_Id) REFERENCES Products(Id) ON DELETE CASCADE ON UPDATE CASCADE);', []);
        tx.executeSql('CREATE INDEX IF NOT EXISTS FoodRecords_FKIndex1 ON FoodRecords (Food_Id);', []);
        tx.executeSql('CREATE INDEX IF NOT EXISTS FoodRecords_FKIndex2 ON FoodRecords (Product_Id);', []);

    },error => {
        console.log(error);
    }, () => {
        console.log('Create table Ok');
    })    

}

const SampleData = (db:WebSQLDatabase) => {

    const groups:Array<IGroup> = Object.values(Group).map((v,i) => {
        return { Name: v.toString() }
    })

    db.transaction(tr => {
        
        groups.map((group, i) => {
            tr.executeSql(`INSERT INTO ${PRODUCT_GROUP_TABLE} (${PRODUCT_GROUP_TABLE_NAME}) SELECT \'${group.Name}\' WHERE NOT EXISTS (SELECT 1 FROM ${PRODUCT_GROUP_TABLE} WHERE ${PRODUCT_GROUP_TABLE_NAME} = \'${group.Name}\');`)
        })

    })

    const products: Array<IProduct> = [
        { Name: 'Бобы', Calories: 58, Proteins: 6, Fats: 0.1, Carbohydrates: 8.3, Gi: 0, Xe: 0.83, Group: { Name: 'Бобовые' } },
        { Name: 'Горох лущеный', Calories: 323, Proteins: 23, Fats: 1.6, Carbohydrates: 57.7, Gi: 0, Xe: 5.77, Group: { Name: 'Бобовые' } },
        { Name: 'Горох цельный', Calories: 303, Proteins: 23, Fats: 1.2, Carbohydrates: 53.3, Gi: 0, Xe: 5.33, Group: { Name: 'Бобовые' } },
        { Name: 'Соя', Calories: 395, Proteins: 34.9, Fats: 17.3, Carbohydrates: 26.5, Gi: 0, Xe: 2.65, Group: { Name: 'Бобовые' } },
        { Name: 'Фасоль', Calories: 309, Proteins: 22.3, Fats: 1.7, Carbohydrates: 54.5, Gi: 0, Xe: 5.45, Group: { Name: 'Бобовые' } },
        { Name: 'Чечевица', Calories: 310, Proteins: 24.8, Fats: 1.1, Carbohydrates: 53.7, Gi: 0, Xe: 5.37, Group: { Name: 'Бобовые' } },
        { Name: 'Белые свежие', Calories: 25, Proteins: 3.2, Fats: 0.7, Carbohydrates: 1.6, Gi: 0, Xe: 0.16, Group: { Name: 'Грибы' } },
        { Name: 'Белые сушеные', Calories: 209, Proteins: 27.6, Fats: 6.8, Carbohydrates: 10, Gi: 0, Xe: 1, Group: { Name: 'Грибы' } },
        { Name: 'Подберезовики свежие', Calories: 31, Proteins: 2.3, Fats: 0.9, Carbohydrates: 3.7, Gi: 0, Xe: 0.37, Group: { Name: 'Грибы' } },
        { Name: 'Подосиновики свежие', Calories: 31, Proteins: 3.3, Fats: 0.5, Carbohydrates: 3.4, Gi: 0, Xe: 0.34, Group: { Name: 'Грибы' } },
        { Name: 'Сыроежки свежие', Calories: 17, Proteins: 1.7, Fats: 0.3, Carbohydrates: 1.4, Gi: 0, Xe: 0.14, Group: { Name: 'Грибы' } },
        { Name: 'Жир топленый', Calories: 897, Proteins: 0, Fats: 99.7, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Жиры, маргарин, масло' } },
        { Name: 'Шпик свиной (без шкурки)', Calories: 816, Proteins: 1.4, Fats: 92.8, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Жиры, маргарин, масло' } },
        { Name: 'Маргарин молочный', Calories: 746, Proteins: 0.3, Fats: 82.3, Carbohydrates: 1, Gi: 0, Xe: 0.1, Group: { Name: 'Жиры, маргарин, масло' } },
        { Name: 'Маргарин бутербродный', Calories: 744, Proteins: 0.5, Fats: 82, Carbohydrates: 1.2, Gi: 0, Xe: 0.12, Group: { Name: 'Жиры, маргарин, масло' } },
        { Name: 'Майонез', Calories: 627, Proteins: 3.1, Fats: 67, Carbohydrates: 2.6, Gi: 0, Xe: 0.26, Group: { Name: 'Жиры, маргарин, масло' } },
        { Name: 'Масло растительное', Calories: 899, Proteins: 0, Fats: 99.9, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Жиры, маргарин, масло' } },
        { Name: 'Масло сливочное', Calories: 748, Proteins: 0.6, Fats: 82.5, Carbohydrates: 0.9, Gi: 0, Xe: 0.09, Group: { Name: 'Жиры, маргарин, масло' } },
        { Name: 'Масло топленое', Calories: 887, Proteins: 0.3, Fats: 98, Carbohydrates: 0.6, Gi: 0, Xe: 0.06, Group: { Name: 'Жиры, маргарин, масло' } },
        { Name: 'Кеты зернистая', Calories: 251, Proteins: 31.6, Fats: 13.8, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Икра' } },
        { Name: 'Лещевая пробойная', Calories: 142, Proteins: 24.7, Fats: 4.8, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Икра' } },
        { Name: 'Минтаевая пробойная', Calories: 131, Proteins: 28.4, Fats: 1.9, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Икра' } },
        { Name: 'Осетровая зернистая', Calories: 203, Proteins: 28.9, Fats: 9.7, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Икра' } },
        { Name: 'Осетровая пробойная', Calories: 123, Proteins: 36, Fats: 10.2, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Икра' } },
        { Name: 'Вареная колбаса Диабетическая', Calories: 254, Proteins: 12.1, Fats: 22.8, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Колбаса и колбасные изделия' } },
        { Name: 'Вареная колбаса Диетическая', Calories: 170, Proteins: 12.1, Fats: 13.5, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Колбаса и колбасные изделия' } },
        { Name: 'Вареная колбаса Докторская', Calories: 260, Proteins: 13.7, Fats: 22.8, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Колбаса и колбасные изделия' } },
        { Name: 'Вареная колбаса Любительская', Calories: 301, Proteins: 12.2, Fats: 28, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Колбаса и колбасные изделия' } },
        { Name: 'Вареная колбаса Молочная', Calories: 252, Proteins: 11.7, Fats: 22.8, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Колбаса и колбасные изделия' } },
        { Name: 'Вареная колбаса Отдельная', Calories: 228, Proteins: 10.1, Fats: 20.1, Carbohydrates: 1.8, Gi: 0, Xe: 0.18, Group: { Name: 'Колбаса и колбасные изделия' } },
        { Name: 'Вареная колбаса Телячья', Calories: 316, Proteins: 12.5, Fats: 29.6, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Колбаса и колбасные изделия' } },
        { Name: 'Сардельки Свиные', Calories: 332, Proteins: 10.1, Fats: 31.6, Carbohydrates: 1.9, Gi: 0, Xe: 0.19, Group: { Name: 'Колбаса и колбасные изделия' } },
        { Name: 'Сосиски Молочные', Calories: 277, Proteins: 12.3, Fats: 25.3, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Колбаса и колбасные изделия' } },
        { Name: 'Сосиски Русские', Calories: 220, Proteins: 12, Fats: 19.1, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Колбаса и колбасные изделия' } },
        { Name: 'Сосиски Свиные', Calories: 324, Proteins: 11.8, Fats: 30.8, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Колбаса и колбасные изделия' } },
        { Name: 'Варено-копченая Любительская', Calories: 420, Proteins: 17.3, Fats: 39, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Колбаса и колбасные изделия' } },
        { Name: 'Варено-копченая Сервелат', Calories: 360, Proteins: 28.2, Fats: 27.5, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Колбаса и колбасные изделия' } },
        { Name: 'Полукопченая Краковская', Calories: 466, Proteins: 16.2, Fats: 44.6, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Колбаса и колбасные изделия' } },
        { Name: 'Полукопченая Минская', Calories: 259, Proteins: 23, Fats: 17.4, Carbohydrates: 2.7, Gi: 0, Xe: 0.27, Group: { Name: 'Колбаса и колбасные изделия' } },
        { Name: 'Полукопченая Полтавская', Calories: 417, Proteins: 16.4, Fats: 39, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Колбаса и колбасные изделия' } },
        { Name: 'Полукопченая Украинская', Calories: 376, Proteins: 16.5, Fats: 34.4, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Колбаса и колбасные изделия' } },
        { Name: 'Сырокопченая Любительская', Calories: 514, Proteins: 20.9, Fats: 47.8, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Колбаса и колбасные изделия' } },
        { Name: 'Сырокопченая Московская', Calories: 473, Proteins: 24.8, Fats: 41.5, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Колбаса и колбасные изделия' } },
        { Name: 'Гречневая ядрица', Calories: 329, Proteins: 12.6, Fats: 2.6, Carbohydrates: 68, Gi: 0, Xe: 6.8, Group: { Name: 'Крупы' } },
        { Name: 'Гречневая продел', Calories: 326, Proteins: 9.5, Fats: 1.9, Carbohydrates: 72.2, Gi: 0, Xe: 7.22, Group: { Name: 'Крупы' } },
        { Name: 'Манная', Calories: 326, Proteins: 11.3, Fats: 0.7, Carbohydrates: 73.3, Gi: 0, Xe: 7.33, Group: { Name: 'Крупы' } },
        { Name: 'Овсяная', Calories: 345, Proteins: 11.9, Fats: 5.8, Carbohydrates: 65.4, Gi: 0, Xe: 6.54, Group: { Name: 'Крупы' } },
        { Name: 'Перловая', Calories: 324, Proteins: 9.3, Fats: 1.1, Carbohydrates: 73.7, Gi: 0, Xe: 7.37, Group: { Name: 'Крупы' } },
        { Name: 'Пшено', Calories: 334, Proteins: 12, Fats: 2.9, Carbohydrates: 69.3, Gi: 0, Xe: 6.93, Group: { Name: 'Крупы' } },
        { Name: 'Рисовая', Calories: 323, Proteins: 7, Fats: 0.6, Carbohydrates: 73.7, Gi: 0, Xe: 7.37, Group: { Name: 'Крупы' } },
        { Name: 'Пшеничная “Полтавская”', Calories: 325, Proteins: 12.7, Fats: 1.1, Carbohydrates: 70.6, Gi: 0, Xe: 7.06, Group: { Name: 'Крупы' } },
        { Name: 'Толокно', Calories: 357, Proteins: 12.2, Fats: 5.8, Carbohydrates: 68.3, Gi: 0, Xe: 6.83, Group: { Name: 'Крупы' } },
        { Name: 'Ячневая', Calories: 322, Proteins: 10.4, Fats: 1.3, Carbohydrates: 71.7, Gi: 0, Xe: 7.17, Group: { Name: 'Крупы' } },
        { Name: 'Геркулес', Calories: 355, Proteins: 13.1, Fats: 6.2, Carbohydrates: 65.7, Gi: 0, Xe: 6.57, Group: { Name: 'Крупы' } },
        { Name: 'Кукурузная', Calories: 325, Proteins: 8.3, Fats: 1.2, Carbohydrates: 75, Gi: 0, Xe: 7.5, Group: { Name: 'Крупы' } },
        { Name: 'Брынза из коровьего молока', Calories: 260, Proteins: 17.9, Fats: 20.1, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Молоко и молочные продукты' } },
        { Name: 'Йогурт нат. 1.5% жирности', Calories: 51, Proteins: 5, Fats: 1.5, Carbohydrates: 3.5, Gi: 0, Xe: 0.35, Group: { Name: 'Молоко и молочные продукты' } },
        { Name: 'Кефир нежирный', Calories: 30, Proteins: 3, Fats: 0.1, Carbohydrates: 3.8, Gi: 0, Xe: 0.38, Group: { Name: 'Молоко и молочные продукты' } },
        { Name: 'Кефир жирный', Calories: 59, Proteins: 2.8, Fats: 3.2, Carbohydrates: 4.1, Gi: 0, Xe: 0.41, Group: { Name: 'Молоко и молочные продукты' } },
        { Name: 'Молоко', Calories: 58, Proteins: 2.8, Fats: 3.2, Carbohydrates: 4.7, Gi: 0, Xe: 0.47, Group: { Name: 'Молоко и молочные продукты' } },
        { Name: 'Молоко ацидофильное', Calories: 83, Proteins: 2.8, Fats: 3.2, Carbohydrates: 10.8, Gi: 0, Xe: 1.08, Group: { Name: 'Молоко и молочные продукты' } },
        { Name: 'Молоко сухое цельное', Calories: 475, Proteins: 25.6, Fats: 25, Carbohydrates: 39.4, Gi: 0, Xe: 3.94, Group: { Name: 'Молоко и молочные продукты' } },
        { Name: 'Молоко сгущенное', Calories: 135, Proteins: 7, Fats: 7.9, Carbohydrates: 9.5, Gi: 0, Xe: 0.95, Group: { Name: 'Молоко и молочные продукты' } },
        { Name: 'Молоко сгущенное с сахаром', Calories: 315, Proteins: 7.2, Fats: 8.5, Carbohydrates: 56, Gi: 0, Xe: 5.6, Group: { Name: 'Молоко и молочные продукты' } },
        { Name: 'Простокваша', Calories: 58, Proteins: 2.8, Fats: 3.2, Carbohydrates: 4.1, Gi: 0, Xe: 0.41, Group: { Name: 'Молоко и молочные продукты' } },
        { Name: 'Ряженка', Calories: 85, Proteins: 3, Fats: 6, Carbohydrates: 4.1, Gi: 0, Xe: 0.41, Group: { Name: 'Молоко и молочные продукты' } },
        { Name: 'Сливки 10%', Calories: 118, Proteins: 3, Fats: 10, Carbohydrates: 4, Gi: 0, Xe: 0.4, Group: { Name: 'Молоко и молочные продукты' } },
        { Name: 'Сливки 20%', Calories: 205, Proteins: 2.8, Fats: 20, Carbohydrates: 3.6, Gi: 0, Xe: 0.36, Group: { Name: 'Молоко и молочные продукты' } },
        { Name: 'Сметана 10%', Calories: 116, Proteins: 3, Fats: 10, Carbohydrates: 2.9, Gi: 0, Xe: 0.29, Group: { Name: 'Молоко и молочные продукты' } },
        { Name: 'Сметана 20%', Calories: 206, Proteins: 2.8, Fats: 20, Carbohydrates: 3.2, Gi: 0, Xe: 0.32, Group: { Name: 'Молоко и молочные продукты' } },
        { Name: 'Сырки и масса творожные особые', Calories: 340, Proteins: 7.1, Fats: 23, Carbohydrates: 27.5, Gi: 0, Xe: 2.75, Group: { Name: 'Молоко и молочные продукты' } },
        { Name: 'Сыр российский', Calories: 371, Proteins: 23.4, Fats: 30, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Молоко и молочные продукты' } },
        { Name: 'Сыр голландский', Calories: 361, Proteins: 26.8, Fats: 27.3, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Молоко и молочные продукты' } },
        { Name: 'Сыр швейцарский', Calories: 396, Proteins: 24.9, Fats: 31.8, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Молоко и молочные продукты' } },
        { Name: 'Сыр пошехонский', Calories: 334, Proteins: 26, Fats: 26.5, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Молоко и молочные продукты' } },
        { Name: 'Сыр плавленный', Calories: 226, Proteins: 24, Fats: 13.5, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Молоко и молочные продукты' } },
        { Name: 'Творог жирный', Calories: 226, Proteins: 14, Fats: 18, Carbohydrates: 1.3, Gi: 0, Xe: 0.13, Group: { Name: 'Молоко и молочные продукты' } },
        { Name: 'Творог полужирный', Calories: 156, Proteins: 16.7, Fats: 9, Carbohydrates: 1.3, Gi: 0, Xe: 0.13, Group: { Name: 'Молоко и молочные продукты' } },
        { Name: 'Творог нежирный', Calories: 86, Proteins: 18, Fats: 0.6, Carbohydrates: 1.5, Gi: 0, Xe: 0.15, Group: { Name: 'Молоко и молочные продукты' } },
        { Name: 'Говядина тушеная', Calories: 232, Proteins: 16.8, Fats: 18.3, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Мясные консервы и копчености' } },
        { Name: 'Завтрак туриста (говядина)', Calories: 176, Proteins: 20.5, Fats: 10.4, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Мясные консервы и копчености' } },
        { Name: 'Завтрак туриста (свинина)', Calories: 206, Proteins: 16.9, Fats: 15.4, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Мясные консервы и копчености' } },
        { Name: 'Колбасный фарш', Calories: 213, Proteins: 15.2, Fats: 15.7, Carbohydrates: 2.8, Gi: 0, Xe: 0.28, Group: { Name: 'Мясные консервы и копчености' } },
        { Name: 'Свинина тушеная', Calories: 349, Proteins: 14.9, Fats: 32.2, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Мясные консервы и копчености' } },
        { Name: 'Грудинка сырокопченая', Calories: 632, Proteins: 7.6, Fats: 66.8, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Мясные консервы и копчености' } },
        { Name: 'Корейка сырокопченая', Calories: 467, Proteins: 10.5, Fats: 47.2, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Мясные консервы и копчености' } },
        { Name: 'Ветчина', Calories: 279, Proteins: 22.6, Fats: 20.9, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Мясные консервы и копчености' } },
        { Name: 'Баранина', Calories: 203, Proteins: 16.3, Fats: 15.3, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Мясо, субпродукты, птица' } },
        { Name: 'Говядина', Calories: 187, Proteins: 18.9, Fats: 12.4, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Мясо, субпродукты, птица' } },
        { Name: 'Конина', Calories: 143, Proteins: 20.2, Fats: 7, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Мясо, субпродукты, птица' } },
        { Name: 'Кролик', Calories: 199, Proteins: 20.7, Fats: 12.9, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Мясо, субпродукты, птица' } },
        { Name: 'Свинина нежирная', Calories: 316, Proteins: 16.4, Fats: 27.8, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Мясо, субпродукты, птица' } },
        { Name: 'Свинина жирная', Calories: 489, Proteins: 11.4, Fats: 49.3, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Мясо, субпродукты, птица' } },
        { Name: 'Телятина', Calories: 90, Proteins: 19.7, Fats: 1.2, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Мясо, субпродукты, птица' } },
        { Name: 'Бараньи Почки', Calories: 77, Proteins: 13.6, Fats: 2.5, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Мясо, субпродукты, птица' } },
        { Name: 'Баранья Печень', Calories: 101, Proteins: 18.7, Fats: 2.9, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Мясо, субпродукты, птица' } },
        { Name: 'Баранье Сердце', Calories: 82, Proteins: 13.5, Fats: 2.5, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Мясо, субпродукты, птица' } },
        { Name: 'Говяжьи Мозги', Calories: 124, Proteins: 9.5, Fats: 9.5, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Мясо, субпродукты, птица' } },
        { Name: 'Говяжья Печень', Calories: 98, Proteins: 17.4, Fats: 3.1, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Мясо, субпродукты, птица' } },
        { Name: 'Говяжьи Почки', Calories: 66, Proteins: 12.5, Fats: 1.8, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Мясо, субпродукты, птица' } },
        { Name: 'Говяжье Вымя', Calories: 173, Proteins: 12.3, Fats: 13.7, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Мясо, субпродукты, птица' } },
        { Name: 'Говяжье Сердце', Calories: 87, Proteins: 15, Fats: 3, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Мясо, субпродукты, птица' } },
        { Name: 'Говяжий Язык', Calories: 163, Proteins: 13.6, Fats: 12.1, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Мясо, субпродукты, птица' } },
        { Name: 'Почки свиные', Calories: 80, Proteins: 13, Fats: 3.1, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Мясо, субпродукты, птица' } },
        { Name: 'Печень свиная', Calories: 108, Proteins: 18.8, Fats: 3.6, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Мясо, субпродукты, птица' } },
        { Name: 'Сердце свиное', Calories: 89, Proteins: 15.1, Fats: 3.2, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Мясо, субпродукты, птица' } },
        { Name: 'Язык свиной', Calories: 208, Proteins: 14.2, Fats: 16.8, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Мясо, субпродукты, птица' } },
        { Name: 'Гуси', Calories: 364, Proteins: 16.1, Fats: 33.3, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Мясо, субпродукты, птица' } },
        { Name: 'Индейка', Calories: 197, Proteins: 21.6, Fats: 12, Carbohydrates: 0.8, Gi: 0, Xe: 0.08, Group: { Name: 'Мясо, субпродукты, птица' } },
        { Name: 'Куры', Calories: 165, Proteins: 20.8, Fats: 8.8, Carbohydrates: 0.6, Gi: 0, Xe: 0.06, Group: { Name: 'Мясо, субпродукты, птица' } },
        { Name: 'Цыплята', Calories: 156, Proteins: 18.7, Fats: 7.8, Carbohydrates: 0.4, Gi: 0, Xe: 0.04, Group: { Name: 'Мясо, субпродукты, птица' } },
        { Name: 'Утки', Calories: 346, Proteins: 16.5, Fats: 61.2, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Мясо, субпродукты, птица' } },
        { Name: 'Баклажаны', Calories: 24, Proteins: 0.6, Fats: 0.1, Carbohydrates: 5.5, Gi: 0, Xe: 0.55, Group: { Name: 'Овощи' } },
        { Name: 'Брюква', Calories: 37, Proteins: 1.2, Fats: 0.1, Carbohydrates: 8.1, Gi: 0, Xe: 0.81, Group: { Name: 'Овощи' } },
        { Name: 'Горошек зеленый', Calories: 72, Proteins: 5, Fats: 0.2, Carbohydrates: 13.3, Gi: 0, Xe: 1.33, Group: { Name: 'Овощи' } },
        { Name: 'Кабачки', Calories: 27, Proteins: 0.6, Fats: 0.3, Carbohydrates: 5.7, Gi: 0, Xe: 0.57, Group: { Name: 'Овощи' } },
        { Name: 'Капуста белокочанная', Calories: 28, Proteins: 1.8, Fats: 0, Carbohydrates: 5.4, Gi: 0, Xe: 0.54, Group: { Name: 'Овощи' } },
        { Name: 'Капуста краснокочанная', Calories: 31, Proteins: 1.8, Fats: 0, Carbohydrates: 6.1, Gi: 0, Xe: 0.61, Group: { Name: 'Овощи' } },
        { Name: 'Капуста цветная', Calories: 29, Proteins: 2.5, Fats: 0, Carbohydrates: 4.9, Gi: 0, Xe: 0.49, Group: { Name: 'Овощи' } },
        { Name: 'Картофель', Calories: 83, Proteins: 2, Fats: 0.1, Carbohydrates: 19.7, Gi: 0, Xe: 1.97, Group: { Name: 'Овощи' } },
        { Name: 'Лук зеленый (перо)', Calories: 22, Proteins: 1.3, Fats: 0, Carbohydrates: 4.3, Gi: 0, Xe: 0.43, Group: { Name: 'Овощи' } },
        { Name: 'Лук порей', Calories: 40, Proteins: 3, Fats: 0, Carbohydrates: 7.3, Gi: 0, Xe: 0.73, Group: { Name: 'Овощи' } },
        { Name: 'Лук репчатый', Calories: 43, Proteins: 1.7, Fats: 0, Carbohydrates: 9.5, Gi: 0, Xe: 0.95, Group: { Name: 'Овощи' } },
        { Name: 'Морковь красная', Calories: 33, Proteins: 1.3, Fats: 0.1, Carbohydrates: 7, Gi: 0, Xe: 0.7, Group: { Name: 'Овощи' } },
        { Name: 'Огурцы грунтовые', Calories: 15, Proteins: 0.8, Fats: 0, Carbohydrates: 3, Gi: 0, Xe: 0.3, Group: { Name: 'Овощи' } },
        { Name: 'Огурцы парниковые', Calories: 10, Proteins: 0.7, Fats: 0, Carbohydrates: 1.8, Gi: 0, Xe: 0.18, Group: { Name: 'Овощи' } },
        { Name: 'Перец зеленый сладкий', Calories: 23, Proteins: 1.3, Fats: 0, Carbohydrates: 4.7, Gi: 0, Xe: 0.47, Group: { Name: 'Овощи' } },
        { Name: 'Перец красный сладкий', Calories: 27, Proteins: 1.3, Fats: 0, Carbohydrates: 5.7, Gi: 0, Xe: 0.57, Group: { Name: 'Овощи' } },
        { Name: 'Петрушка (зелень)', Calories: 45, Proteins: 3.7, Fats: 0, Carbohydrates: 8.1, Gi: 0, Xe: 0.81, Group: { Name: 'Овощи' } },
        { Name: 'Петрушка (корень)', Calories: 47, Proteins: 1.5, Fats: 0, Carbohydrates: 11, Gi: 0, Xe: 1.1, Group: { Name: 'Овощи' } },
        { Name: 'Ревень (черешковый)', Calories: 16, Proteins: 0.7, Fats: 0, Carbohydrates: 2.9, Gi: 0, Xe: 0.29, Group: { Name: 'Овощи' } },
        { Name: 'Редис', Calories: 20, Proteins: 1.2, Fats: 0, Carbohydrates: 4.1, Gi: 0, Xe: 0.41, Group: { Name: 'Овощи' } },
        { Name: 'Редька', Calories: 34, Proteins: 1.9, Fats: 0, Carbohydrates: 7, Gi: 0, Xe: 0.7, Group: { Name: 'Овощи' } },
        { Name: 'Репа', Calories: 28, Proteins: 1.5, Fats: 0, Carbohydrates: 5.9, Gi: 0, Xe: 0.59, Group: { Name: 'Овощи' } },
        { Name: 'Салат', Calories: 14, Proteins: 1.5, Fats: 0, Carbohydrates: 2.2, Gi: 0, Xe: 0.22, Group: { Name: 'Овощи' } },
        { Name: 'Свекла', Calories: 48, Proteins: 1.7, Fats: 0, Carbohydrates: 10.8, Gi: 0, Xe: 1.08, Group: { Name: 'Овощи' } },
        { Name: 'Томаты (грунтовые)', Calories: 19, Proteins: 0.6, Fats: 0, Carbohydrates: 4.2, Gi: 0, Xe: 0.42, Group: { Name: 'Овощи' } },
        { Name: 'Томаты (парниковые)', Calories: 14, Proteins: 0.6, Fats: 0, Carbohydrates: 2.9, Gi: 0, Xe: 0.29, Group: { Name: 'Овощи' } },
        { Name: 'Зеленая фасоль', Calories: 32, Proteins: 4, Fats: 0, Carbohydrates: 4.3, Gi: 0, Xe: 0.43, Group: { Name: 'Овощи' } },
        { Name: 'Хрен', Calories: 71, Proteins: 2.5, Fats: 0, Carbohydrates: 16.3, Gi: 0, Xe: 1.63, Group: { Name: 'Овощи' } },
        { Name: 'Черемша', Calories: 34, Proteins: 2.4, Fats: 0, Carbohydrates: 6.5, Gi: 0, Xe: 0.65, Group: { Name: 'Овощи' } },
        { Name: 'Чеснок', Calories: 106, Proteins: 6.5, Fats: 0, Carbohydrates: 21.2, Gi: 0, Xe: 2.12, Group: { Name: 'Овощи' } },
        { Name: 'Шпинат', Calories: 21, Proteins: 2.9, Fats: 0, Carbohydrates: 2.3, Gi: 0, Xe: 0.23, Group: { Name: 'Овощи' } },
        { Name: 'Щавель', Calories: 28, Proteins: 1.5, Fats: 0, Carbohydrates: 5.3, Gi: 0, Xe: 0.53, Group: { Name: 'Овощи' } },
        { Name: 'Фундук', Calories: 704, Proteins: 16.1, Fats: 66.9, Carbohydrates: 9.9, Gi: 0, Xe: 0.99, Group: { Name: 'Орехи' } },
        { Name: 'Миндаль', Calories: 645, Proteins: 18.6, Fats: 57.7, Carbohydrates: 13.6, Gi: 0, Xe: 1.36, Group: { Name: 'Орехи' } },
        { Name: 'Грецкий орех', Calories: 648, Proteins: 13.8, Fats: 61.3, Carbohydrates: 10.2, Gi: 0, Xe: 1.02, Group: { Name: 'Орехи' } },
        { Name: 'Арахис', Calories: 548, Proteins: 26.3, Fats: 45.2, Carbohydrates: 9.7, Gi: 0, Xe: 0.97, Group: { Name: 'Орехи' } },
        { Name: 'Семя подсолнечника', Calories: 578, Proteins: 20.7, Fats: 52.9, Carbohydrates: 5, Gi: 0, Xe: 0.5, Group: { Name: 'Орехи' } },
        { Name: 'Бычки', Calories: 145, Proteins: 12.8, Fats: 8.1, Carbohydrates: 5.2, Gi: 0, Xe: 0.52, Group: { Name: 'Рыба и морепродукты' } },
        { Name: 'Горбуша', Calories: 147, Proteins: 21, Fats: 7, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Рыба и морепродукты' } },
        { Name: 'Камбала', Calories: 88, Proteins: 16.1, Fats: 2.6, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Рыба и морепродукты' } },
        { Name: 'Карась', Calories: 87, Proteins: 17.7, Fats: 1.8, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Рыба и морепродукты' } },
        { Name: 'Карп', Calories: 96, Proteins: 16, Fats: 3.6, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Рыба и морепродукты' } },
        { Name: 'Кета', Calories: 138, Proteins: 22, Fats: 5.6, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Рыба и морепродукты' } },
        { Name: 'Корюшка', Calories: 91, Proteins: 15.5, Fats: 3.2, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Рыба и морепродукты' } },
        { Name: 'Ледяная', Calories: 75, Proteins: 15.5, Fats: 1.4, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Рыба и морепродукты' } },
        { Name: 'Лещ', Calories: 105, Proteins: 17.1, Fats: 4.1, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Рыба и морепродукты' } },
        { Name: 'Семга', Calories: 219, Proteins: 20.8, Fats: 15.1, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Рыба и морепродукты' } },
        { Name: 'Макрурус', Calories: 60, Proteins: 13.2, Fats: 0.8, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Рыба и морепродукты' } },
        { Name: 'Минога', Calories: 166, Proteins: 14.7, Fats: 11.9, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Рыба и морепродукты' } },
        { Name: 'Минтай', Calories: 70, Proteins: 15.9, Fats: 0.7, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Рыба и морепродукты' } },
        { Name: 'Мойва', Calories: 157, Proteins: 13.4, Fats: 11.5, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Рыба и морепродукты' } },
        { Name: 'Навага', Calories: 73, Proteins: 16.1, Fats: 1, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Рыба и морепродукты' } },
        { Name: 'Налим', Calories: 81, Proteins: 18.8, Fats: 0.6, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Рыба и морепродукты' } },
        { Name: 'Нототения мраморная', Calories: 156, Proteins: 14.8, Fats: 10.7, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Рыба и морепродукты' } },
        { Name: 'Окунь морской', Calories: 117, Proteins: 17.6, Fats: 5.2, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Рыба и морепродукты' } },
        { Name: 'Окунь речной', Calories: 82, Proteins: 18.5, Fats: 0.9, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Рыба и морепродукты' } },
        { Name: 'Осетр', Calories: 164, Proteins: 16.4, Fats: 10.9, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Рыба и морепродукты' } },
        { Name: 'Палтус', Calories: 103, Proteins: 18.9, Fats: 3, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Рыба и морепродукты' } },
        { Name: 'Путассу', Calories: 72, Proteins: 16.1, Fats: 0.9, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Рыба и морепродукты' } },
        { Name: 'Рыба-сабля', Calories: 110, Proteins: 20.3, Fats: 3.2, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Рыба и морепродукты' } },
        { Name: 'Рыбец каспийский', Calories: 98, Proteins: 19.2, Fats: 2.4, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Рыба и морепродукты' } },
        { Name: 'Сазан', Calories: 121, Proteins: 18.4, Fats: 5.3, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Рыба и морепродукты' } },
        { Name: 'Сайра крупная', Calories: 262, Proteins: 18.6, Fats: 20.8, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Рыба и морепродукты' } },
        { Name: 'Сайра мелкая', Calories: 143, Proteins: 20.4, Fats: 0.8, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Рыба и морепродукты' } },
        { Name: 'Салака', Calories: 121, Proteins: 17.3, Fats: 5.6, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Рыба и морепродукты' } },
        { Name: 'Сельдь', Calories: 242, Proteins: 17.7, Fats: 19.5, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Рыба и морепродукты' } },
        { Name: 'Сиг', Calories: 144, Proteins: 19, Fats: 7.5, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Рыба и морепродукты' } },
        { Name: 'Скумбрия', Calories: 153, Proteins: 18, Fats: 9, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Рыба и морепродукты' } },
        { Name: 'Сом', Calories: 144, Proteins: 16.8, Fats: 8.5, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Рыба и морепродукты' } },
        { Name: 'Ставрида', Calories: 119, Proteins: 18.5, Fats: 5, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Рыба и морепродукты' } },
        { Name: 'Стерлядь', Calories: 320, Proteins: 17, Fats: 6.1, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Рыба и морепродукты' } },
        { Name: 'Судак', Calories: 83, Proteins: 19, Fats: 0.8, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Рыба и морепродукты' } },
        { Name: 'Треска', Calories: 75, Proteins: 17.5, Fats: 0.6, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Рыба и морепродукты' } },
        { Name: 'Тунец', Calories: 96, Proteins: 22.7, Fats: 0.7, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Рыба и морепродукты' } },
        { Name: 'Угольная рыба', Calories: 158, Proteins: 13.2, Fats: 11.6, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Рыба и морепродукты' } },
        { Name: 'Угорь морской', Calories: 94, Proteins: 19.1, Fats: 1.9, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Рыба и морепродукты' } },
        { Name: 'Угорь', Calories: 333, Proteins: 14.5, Fats: 30.5, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Рыба и морепродукты' } },
        { Name: 'Хек', Calories: 86, Proteins: 16.6, Fats: 2.2, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Рыба и морепродукты' } },
        { Name: 'Щука', Calories: 82, Proteins: 18.8, Fats: 0.7, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Рыба и морепродукты' } },
        { Name: 'Язь', Calories: 117, Proteins: 18.2, Fats: 0.3, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Рыба и морепродукты' } },
        { Name: 'Креветка дальневосточная', Calories: 134, Proteins: 28.7, Fats: 1.2, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Рыба и морепродукты' } },
        { Name: 'Печень трески', Calories: 613, Proteins: 4.2, Fats: 65.7, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Рыба и морепродукты' } },
        { Name: 'Кальмар', Calories: 75, Proteins: 18, Fats: 0.3, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Рыба и морепродукты' } },
        { Name: 'Краб', Calories: 69, Proteins: 16, Fats: 0.5, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Рыба и морепродукты' } },
        { Name: 'Креветка', Calories: 83, Proteins: 18, Fats: 0.8, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Рыба и морепродукты' } },
        { Name: 'Морская капуста', Calories: 5, Proteins: 0.9, Fats: 0.2, Carbohydrates: 3, Gi: 0, Xe: 0.3, Group: { Name: 'Рыба и морепродукты' } },
        { Name: 'Паста “Океан”', Calories: 137, Proteins: 18.9, Fats: 6.8, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Рыба и морепродукты' } },
        { Name: 'Трепанг', Calories: 35, Proteins: 7.3, Fats: 0.6, Carbohydrates: 0, Gi: 0, Xe: 0, Group: { Name: 'Рыба и морепродукты' } },
        { Name: 'Мед', Calories: 308, Proteins: 0.8, Fats: 0, Carbohydrates: 80.3, Gi: 0, Xe: 8.03, Group: { Name: 'Сладости' } },
        { Name: 'Драже фруктовое', Calories: 384, Proteins: 3.7, Fats: 10.2, Carbohydrates: 73.1, Gi: 0, Xe: 7.31, Group: { Name: 'Сладости' } },
        { Name: 'Зефир', Calories: 299, Proteins: 0.8, Fats: 0, Carbohydrates: 78.3, Gi: 0, Xe: 7.83, Group: { Name: 'Сладости' } },
        { Name: 'Ирис', Calories: 387, Proteins: 3.3, Fats: 7.5, Carbohydrates: 81.8, Gi: 0, Xe: 8.18, Group: { Name: 'Сладости' } },
        { Name: 'Мармелад', Calories: 296, Proteins: 0, Fats: 0.1, Carbohydrates: 77.7, Gi: 0, Xe: 7.77, Group: { Name: 'Сладости' } },
        { Name: 'Карамель', Calories: 296, Proteins: 0, Fats: 0.1, Carbohydrates: 77.7, Gi: 0, Xe: 7.77, Group: { Name: 'Сладости' } },
        { Name: 'Конфеты. глаз-ые шоколадом', Calories: 396, Proteins: 2.9, Fats: 10.7, Carbohydrates: 76.6, Gi: 0, Xe: 7.66, Group: { Name: 'Сладости' } },
        { Name: 'Пастила', Calories: 305, Proteins: 0.5, Fats: 0, Carbohydrates: 80.4, Gi: 0, Xe: 8.04, Group: { Name: 'Сладости' } },
        { Name: 'Сахар', Calories: 374, Proteins: 0.3, Fats: 0, Carbohydrates: 99.5, Gi: 0, Xe: 9.95, Group: { Name: 'Сладости' } },
        { Name: 'Халва тахинная', Calories: 510, Proteins: 12.7, Fats: 29.9, Carbohydrates: 50.6, Gi: 0, Xe: 5.06, Group: { Name: 'Сладости' } },
        { Name: 'Халва подсолнечная', Calories: 516, Proteins: 11.6, Fats: 29.7, Carbohydrates: 54, Gi: 0, Xe: 5.4, Group: { Name: 'Сладости' } },
        { Name: 'Шоколад темный', Calories: 540, Proteins: 5.4, Fats: 35.3, Carbohydrates: 52.6, Gi: 0, Xe: 5.26, Group: { Name: 'Сладости' } },
        { Name: 'Шоколад молочный', Calories: 547, Proteins: 6.9, Fats: 35.7, Carbohydrates: 52.4, Gi: 0, Xe: 5.24, Group: { Name: 'Сладости' } },
        { Name: 'Вафли с фр-ми начинками', Calories: 342, Proteins: 3.2, Fats: 2.8, Carbohydrates: 80.1, Gi: 0, Xe: 8.01, Group: { Name: 'Сладости' } },
        { Name: 'Вафли с жировыми начинками', Calories: 530, Proteins: 3.4, Fats: 30.2, Carbohydrates: 64.7, Gi: 0, Xe: 6.47, Group: { Name: 'Сладости' } },
        { Name: 'Пирожное слоеное с кремом', Calories: 544, Proteins: 5.4, Fats: 38.6, Carbohydrates: 46.4, Gi: 0, Xe: 4.64, Group: { Name: 'Сладости' } },
        { Name: 'Пирожное слоеное с яблоком', Calories: 454, Proteins: 5.7, Fats: 25.6, Carbohydrates: 52.7, Gi: 0, Xe: 5.27, Group: { Name: 'Сладости' } },
        { Name: 'Пирожное бисквитное', Calories: 344, Proteins: 4.7, Fats: 9.3, Carbohydrates: 84.4, Gi: 0, Xe: 8.44, Group: { Name: 'Сладости' } },
        { Name: 'Пряники', Calories: 336, Proteins: 4.8, Fats: 2.8, Carbohydrates: 77.7, Gi: 0, Xe: 7.77, Group: { Name: 'Сладости' } },
        { Name: 'Торт бисквитный', Calories: 386, Proteins: 4.7, Fats: 20, Carbohydrates: 49.8, Gi: 0, Xe: 4.98, Group: { Name: 'Сладости' } },
        { Name: 'Торт миндальный', Calories: 524, Proteins: 6.6, Fats: 35.8, Carbohydrates: 46.8, Gi: 0, Xe: 4.68, Group: { Name: 'Сладости' } },
        { Name: 'Урюк', Calories: 278, Proteins: 5, Fats: 0, Carbohydrates: 67.5, Gi: 0, Xe: 6.75, Group: { Name: 'Сухофрукты' } },
        { Name: 'Курага', Calories: 272, Proteins: 5.2, Fats: 0, Carbohydrates: 65.9, Gi: 0, Xe: 6.59, Group: { Name: 'Сухофрукты' } },
        { Name: 'Изюм с косточкой', Calories: 276, Proteins: 1.8, Fats: 0, Carbohydrates: 70.9, Gi: 0, Xe: 7.09, Group: { Name: 'Сухофрукты' } },
        { Name: 'Изюм кишмиш', Calories: 279, Proteins: 2.3, Fats: 0, Carbohydrates: 71.2, Gi: 0, Xe: 7.12, Group: { Name: 'Сухофрукты' } },
        { Name: 'Вишня', Calories: 292, Proteins: 1.5, Fats: 0, Carbohydrates: 73, Gi: 0, Xe: 7.3, Group: { Name: 'Сухофрукты' } },
        { Name: 'Груша', Calories: 246, Proteins: 2.3, Fats: 0, Carbohydrates: 62.1, Gi: 0, Xe: 6.21, Group: { Name: 'Сухофрукты' } },
        { Name: 'Персики', Calories: 275, Proteins: 3, Fats: 0, Carbohydrates: 68.5, Gi: 0, Xe: 6.85, Group: { Name: 'Сухофрукты' } },
        { Name: 'Чернослив', Calories: 264, Proteins: 2.3, Fats: 0, Carbohydrates: 65.6, Gi: 0, Xe: 6.56, Group: { Name: 'Сухофрукты' } },
        { Name: 'Яблоки', Calories: 273, Proteins: 3.2, Fats: 0, Carbohydrates: 68, Gi: 0, Xe: 6.8, Group: { Name: 'Сухофрукты' } },
        { Name: 'Абрикосы', Calories: 46, Proteins: 0.9, Fats: 0, Carbohydrates: 10.5, Gi: 0, Xe: 1.05, Group: { Name: 'Фрукты и ягоды' } },
        { Name: 'Айва', Calories: 38, Proteins: 0.6, Fats: 0, Carbohydrates: 8.9, Gi: 0, Xe: 0.89, Group: { Name: 'Фрукты и ягоды' } },
        { Name: 'Алыча', Calories: 34, Proteins: 0.2, Fats: 0, Carbohydrates: 7.4, Gi: 0, Xe: 0.74, Group: { Name: 'Фрукты и ягоды' } },
        { Name: 'Ананас', Calories: 48, Proteins: 0.4, Fats: 0, Carbohydrates: 11.8, Gi: 0, Xe: 1.18, Group: { Name: 'Фрукты и ягоды' } },
        { Name: 'Бананы', Calories: 91, Proteins: 1.5, Fats: 0, Carbohydrates: 22.4, Gi: 0, Xe: 2.24, Group: { Name: 'Фрукты и ягоды' } },
        { Name: 'Вишня', Calories: 49, Proteins: 0.8, Fats: 0, Carbohydrates: 11.3, Gi: 0, Xe: 1.13, Group: { Name: 'Фрукты и ягоды' } },
        { Name: 'Гранат', Calories: 52, Proteins: 0.9, Fats: 0, Carbohydrates: 11.8, Gi: 0, Xe: 1.18, Group: { Name: 'Фрукты и ягоды' } },
        { Name: 'Груша', Calories: 42, Proteins: 0.4, Fats: 0, Carbohydrates: 10.7, Gi: 0, Xe: 1.07, Group: { Name: 'Фрукты и ягоды' } },
        { Name: 'Инжир', Calories: 56, Proteins: 0.7, Fats: 0, Carbohydrates: 13.9, Gi: 0, Xe: 1.39, Group: { Name: 'Фрукты и ягоды' } },
        { Name: 'Кизил', Calories: 45, Proteins: 1, Fats: 0, Carbohydrates: 9.7, Gi: 0, Xe: 0.97, Group: { Name: 'Фрукты и ягоды' } },
        { Name: 'Персики', Calories: 44, Proteins: 0.9, Fats: 0, Carbohydrates: 10.4, Gi: 0, Xe: 1.04, Group: { Name: 'Фрукты и ягоды' } },
        { Name: 'Рябина садовая', Calories: 58, Proteins: 1.4, Fats: 0, Carbohydrates: 12.5, Gi: 0, Xe: 1.25, Group: { Name: 'Фрукты и ягоды' } },
        { Name: 'Рябина черноплодная', Calories: 54, Proteins: 1.5, Fats: 0, Carbohydrates: 12, Gi: 0, Xe: 1.2, Group: { Name: 'Фрукты и ягоды' } },
        { Name: 'Слива садовая', Calories: 43, Proteins: 0.8, Fats: 0, Carbohydrates: 9.9, Gi: 0, Xe: 0.99, Group: { Name: 'Фрукты и ягоды' } },
        { Name: 'Финики', Calories: 281, Proteins: 2.5, Fats: 0, Carbohydrates: 72.1, Gi: 0, Xe: 7.21, Group: { Name: 'Фрукты и ягоды' } },
        { Name: 'Хурма', Calories: 62, Proteins: 0.5, Fats: 0, Carbohydrates: 15.9, Gi: 0, Xe: 1.59, Group: { Name: 'Фрукты и ягоды' } },
        { Name: 'Черешня', Calories: 52, Proteins: 1.1, Fats: 0, Carbohydrates: 12.3, Gi: 0, Xe: 1.23, Group: { Name: 'Фрукты и ягоды' } },
        { Name: 'Шелковица', Calories: 53, Proteins: 0.7, Fats: 0, Carbohydrates: 12.7, Gi: 0, Xe: 1.27, Group: { Name: 'Фрукты и ягоды' } },
        { Name: 'Яблоки', Calories: 46, Proteins: 0.4, Fats: 0, Carbohydrates: 11.3, Gi: 0, Xe: 1.13, Group: { Name: 'Фрукты и ягоды' } },
        { Name: 'Апельсин', Calories: 38, Proteins: 0.9, Fats: 0, Carbohydrates: 8.4, Gi: 0, Xe: 0.84, Group: { Name: 'Фрукты и ягоды' } },
        { Name: 'Грейпфрут', Calories: 35, Proteins: 0.9, Fats: 0, Carbohydrates: 7.3, Gi: 0, Xe: 0.73, Group: { Name: 'Фрукты и ягоды' } },
        { Name: 'Лимон', Calories: 31, Proteins: 0.9, Fats: 0, Carbohydrates: 3.6, Gi: 0, Xe: 0.36, Group: { Name: 'Фрукты и ягоды' } },
        { Name: 'Мандарин', Calories: 38, Proteins: 0.8, Fats: 0, Carbohydrates: 8.6, Gi: 0, Xe: 0.86, Group: { Name: 'Фрукты и ягоды' } },
        { Name: 'Брусника', Calories: 40, Proteins: 0.7, Fats: 0, Carbohydrates: 8.6, Gi: 0, Xe: 0.86, Group: { Name: 'Фрукты и ягоды' } },
        { Name: 'Виноград', Calories: 69, Proteins: 0.4, Fats: 0, Carbohydrates: 17.5, Gi: 0, Xe: 1.75, Group: { Name: 'Фрукты и ягоды' } },
        { Name: 'Голубика', Calories: 37, Proteins: 1, Fats: 0, Carbohydrates: 7.7, Gi: 0, Xe: 0.77, Group: { Name: 'Фрукты и ягоды' } },
        { Name: 'Ежевика', Calories: 33, Proteins: 2, Fats: 0, Carbohydrates: 5.3, Gi: 0, Xe: 0.53, Group: { Name: 'Фрукты и ягоды' } },
        { Name: 'Земляника', Calories: 41, Proteins: 1.8, Fats: 0, Carbohydrates: 8.1, Gi: 0, Xe: 0.81, Group: { Name: 'Фрукты и ягоды' } },
        { Name: 'Клюква', Calories: 28, Proteins: 0.5, Fats: 0, Carbohydrates: 4.8, Gi: 0, Xe: 0.48, Group: { Name: 'Фрукты и ягоды' } },
        { Name: 'Крыжовник', Calories: 44, Proteins: 0.7, Fats: 0, Carbohydrates: 9.9, Gi: 0, Xe: 0.99, Group: { Name: 'Фрукты и ягоды' } },
        { Name: 'Малина', Calories: 41, Proteins: 0.8, Fats: 0, Carbohydrates: 9, Gi: 0, Xe: 0.9, Group: { Name: 'Фрукты и ягоды' } },
        { Name: 'Морошка', Calories: 31, Proteins: 0.8, Fats: 0, Carbohydrates: 6.8, Gi: 0, Xe: 0.68, Group: { Name: 'Фрукты и ягоды' } },
        { Name: 'Облепиха', Calories: 30, Proteins: 0.9, Fats: 0, Carbohydrates: 5.5, Gi: 0, Xe: 0.55, Group: { Name: 'Фрукты и ягоды' } },
        { Name: 'Смородина белая', Calories: 39, Proteins: 0.3, Fats: 0, Carbohydrates: 8.7, Gi: 0, Xe: 0.87, Group: { Name: 'Фрукты и ягоды' } },
        { Name: 'Смородина красная', Calories: 38, Proteins: 0.6, Fats: 0, Carbohydrates: 8, Gi: 0, Xe: 0.8, Group: { Name: 'Фрукты и ягоды' } },
        { Name: 'Смородина черная', Calories: 40, Proteins: 1, Fats: 0, Carbohydrates: 8, Gi: 0, Xe: 0.8, Group: { Name: 'Фрукты и ягоды' } },
        { Name: 'Черника', Calories: 40, Proteins: 1.1, Fats: 0, Carbohydrates: 8.6, Gi: 0, Xe: 0.86, Group: { Name: 'Фрукты и ягоды' } },
        { Name: 'Шиповник свежий', Calories: 101, Proteins: 1.6, Fats: 0, Carbohydrates: 24, Gi: 0, Xe: 2.4, Group: { Name: 'Фрукты и ягоды' } },
        { Name: 'Шиповник сушеный', Calories: 253, Proteins: 4, Fats: 0, Carbohydrates: 60, Gi: 0, Xe: 6, Group: { Name: 'Фрукты и ягоды' } },
        { Name: 'Хлеб ржаной', Calories: 214, Proteins: 4.7, Fats: 0.7, Carbohydrates: 49.8, Gi: 0, Xe: 4.98, Group: { Name: 'Хлеб, хлебобулочные изделия, мука' } },
        { Name: 'Хлеб пшен. из муки I сорта', Calories: 254, Proteins: 7.7, Fats: 2.4, Carbohydrates: 53.4, Gi: 0, Xe: 5.34, Group: { Name: 'Хлеб, хлебобулочные изделия, мука' } },
        { Name: 'Сдобная выпечка', Calories: 297, Proteins: 7.6, Fats: 4.5, Carbohydrates: 60, Gi: 0, Xe: 6, Group: { Name: 'Хлеб, хлебобулочные изделия, мука' } },
        { Name: 'Баранки', Calories: 312, Proteins: 10.4, Fats: 1.3, Carbohydrates: 68.7, Gi: 0, Xe: 6.87, Group: { Name: 'Хлеб, хлебобулочные изделия, мука' } },
        { Name: 'Сушки', Calories: 330, Proteins: 11, Fats: 1.3, Carbohydrates: 73, Gi: 0, Xe: 7.3, Group: { Name: 'Хлеб, хлебобулочные изделия, мука' } },
        { Name: 'Сухари пшеничные', Calories: 331, Proteins: 11.2, Fats: 1.4, Carbohydrates: 72.4, Gi: 0, Xe: 7.24, Group: { Name: 'Хлеб, хлебобулочные изделия, мука' } },
        { Name: 'Сухари сливочные', Calories: 397, Proteins: 8.5, Fats: 10.6, Carbohydrates: 71.3, Gi: 0, Xe: 7.13, Group: { Name: 'Хлеб, хлебобулочные изделия, мука' } },
        { Name: 'Мука пшеничная высш. сорта', Calories: 327, Proteins: 10.3, Fats: 0.9, Carbohydrates: 74.2, Gi: 0, Xe: 7.42, Group: { Name: 'Хлеб, хлебобулочные изделия, мука' } },
        { Name: 'Мука пшеничная I сорта', Calories: 329, Proteins: 10.6, Fats: 1.3, Carbohydrates: 73.2, Gi: 0, Xe: 7.32, Group: { Name: 'Хлеб, хлебобулочные изделия, мука' } },
        { Name: 'Мука пшеничная II сорта', Calories: 328, Proteins: 11.7, Fats: 1.8, Carbohydrates: 70.8, Gi: 0, Xe: 7.08, Group: { Name: 'Хлеб, хлебобулочные изделия, мука' } },
        { Name: 'Мука ржаная', Calories: 326, Proteins: 6.9, Fats: 1.1, Carbohydrates: 76.9, Gi: 0, Xe: 7.69, Group: { Name: 'Хлеб, хлебобулочные изделия, мука' } },
        { Name: 'Яйцо куриное', Calories: 157, Proteins: 12.7, Fats: 11.5, Carbohydrates: 0.7, Gi: 0, Xe: 0.07, Group: { Name: 'Яйца' } },
        { Name: 'Яичный порошок', Calories: 542, Proteins: 45, Fats: 37.3, Carbohydrates: 7.1, Gi: 0, Xe: 0.71, Group: { Name: 'Яйца' } },
        { Name: 'Сухой белок', Calories: 336, Proteins: 73.3, Fats: 1.8, Carbohydrates: 7, Gi: 0, Xe: 0.7, Group: { Name: 'Яйца' } },
        { Name: 'Сухой желток', Calories: 623, Proteins: 34.2, Fats: 52.2, Carbohydrates: 4.4, Gi: 0, Xe: 0.44, Group: { Name: 'Яйца' } },
        { Name: 'Яйцо перепелиное', Calories: 168, Proteins: 11.9, Fats: 13.1, Carbohydrates: 0.6, Gi: 0, Xe: 0.06, Group: { Name: 'Яйца' } },

    ]

    db.transaction(tr => {

        products.map((product, i) => {
            const groupQuery = `(select ${PRODUCT_GROUP_TABLE_ID} from ${PRODUCT_GROUP_TABLE} where ${PRODUCT_GROUP_TABLE_NAME} = \'${product.Group?.Name}\')`

            const existsQuery = `(select 1 from ${PRODUCTS_TABLE} where ` + 
                `${PRODUCTS_TABLE_NAME} = \'${product.Name}\' and `+
                `${PRODUCTS_TABLE_GI} = ${product.Gi} and `+
                `${PRODUCTS_TABLE_XE} = ${product.Xe} and `+
                `${PRODUCTS_TABLE_FATS} = ${product.Fats} and `+
                `${PRODUCTS_TABLE_PROTEINS} = ${product.Proteins} and `+
                `${PRODUCTS_TABLE_CARBOHYDRATES} = ${product.Carbohydrates} and `+
                `${PRODUCTS_TABLE_CALORIES} = ${product.Calories} and `+
                `${PRODUCTS_TABLE_GROUP} = ${groupQuery})`;

            const selectQuery = `select \'${product.Name}\', ${product.Gi}, ${product.Xe}, ${product.Fats}, ${product.Proteins}, ${product.Carbohydrates}, ${product.Calories}, ${groupQuery} where not exists ${existsQuery}`

            const sourceQuery = `insert into ${PRODUCTS_TABLE} (` +
                `${PRODUCTS_TABLE_NAME}, `+
                `${PRODUCTS_TABLE_GI}, `+
                `${PRODUCTS_TABLE_XE}, `+
                `${PRODUCTS_TABLE_FATS}, `+
                `${PRODUCTS_TABLE_PROTEINS}, `+
                `${PRODUCTS_TABLE_CARBOHYDRATES}, `+
                `${PRODUCTS_TABLE_CALORIES}, `+
                `${PRODUCTS_TABLE_GROUP}`+
                `) ${selectQuery}`;


            tr.executeSql(sourceQuery, [], (t,r) => {
                // console.log(r.insertId);
                
            });

        })

    }, error => {console.log(error);
    })

}


