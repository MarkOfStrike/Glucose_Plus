import { USER_INFO_TABLE, GLUCOSE_MEASUREMENT_TABLE, FOOD_TABLE, PRODUCTS_TABLE, PRODUCT_GROUP_TABLE, FOOD_RECORD_TABLE, PRODUCT_GROUP_TABLE_NAME, PRODUCT_GROUP_TABLE_ID, PRODUCTS_TABLE_NAME, PRODUCTS_TABLE_GI, PRODUCTS_TABLE_XE, PRODUCTS_TABLE_FATS, PRODUCTS_TABLE_PROTEINS, PRODUCTS_TABLE_CARBOHYDRATES, PRODUCTS_TABLE_CALORIES, PRODUCTS_TABLE_GROUP } from './DataBaseConst';
import React from 'react';

import * as SQLite from 'expo-sqlite';
import { IProduct } from './Models/Product';
import { IGroup } from './Models/ProductGroup';


const DbContext = () => {

    const d = SQLite.openDatabase('UserData.db');

    if(d){
        // DeleteAllTable(d)
        CreateNotExistsTable(d)
        SampleData(d);
    }
    return d;

}

export default DbContext;


const DeleteAllTable = (db:SQLite.WebSQLDatabase) => {

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

const CreateNotExistsTable = (db:SQLite.WebSQLDatabase) => {

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

const SampleData = (db:SQLite.WebSQLDatabase) => {

    const groups:Array<IGroup> = [
        {Name:'Овощи'},
        {Name:'Фрукты'}
    ]

    db.transaction(tr => {
        
        groups.map((group, i) => {
            tr.executeSql(`INSERT INTO ${PRODUCT_GROUP_TABLE} (${PRODUCT_GROUP_TABLE_NAME}) SELECT \'${group.Name}\' WHERE NOT EXISTS (SELECT 1 FROM ${PRODUCT_GROUP_TABLE} WHERE ${PRODUCT_GROUP_TABLE_NAME} = \'${group.Name}\');`)
        })

    })

    const products:Array<IProduct> = [
        {Name: 'Огурец', Calories: 14, Proteins:0, Fats:0, Carbohydrates: 2, Gi:20, Xe:0.17, Group:{Name:'Овощи'}},
        {Name: 'Помидор', Calories: 24, Proteins:1, Fats:0, Carbohydrates: 3, Gi:10, Xe:0.25, Group:{Name:'Овощи'}},
        {Name: 'Цветная капуста', Calories: 30, Proteins:2, Fats:0, Carbohydrates: 4, Gi:15, Xe:0.33, Group:{Name:'Овощи'}},
        {Name: 'Редиска', Calories: 20, Proteins:1, Fats:0, Carbohydrates: 3, Gi:15, Xe:0.25, Group:{Name:'Овощи'}},
        {Name: 'Зелень', Calories: 44, Proteins:3, Fats:0, Carbohydrates: 6, Gi:5, Xe:0.5, Group:{Name:'Овощи'}},
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
