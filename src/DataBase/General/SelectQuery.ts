import React, { FC } from 'react'
import { ResultSetRowList } from 'react-native-sqlite-storage';
import DbContext from '../DataBase';

export interface ISelectQueryParams {
    columns: Array<string>
    tableName: string
    whereParams?: string
}

export const SelectQuery = (params:ISelectQueryParams):ResultSetRowList | null => {

    console.log(params);
    

    const db = DbContext();

    // console.log(db);
    

    // const columns = params.columns.join(',');

    let resultRow: ResultSetRowList | null = null;

    // db.transaction((e) => {
    //     e.executeSql(`select ${columns} from ${params.tableName} ${params.whereParams ?? ''}`, [], ((e, results) => {
    //         console.log("Query completed");

    //         resultRow = results.rows;
    //     }))
    // })

    // db.close();


    return resultRow ?? null;
}