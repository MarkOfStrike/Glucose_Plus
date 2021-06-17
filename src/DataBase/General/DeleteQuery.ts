import DbContext from '../DataBase';

export const DeleteRecord = (props:any) => {

    const db = DbContext();

    db.transaction((tr) => {
        tr.executeSql(`delete from ${props.table} ${props.where ?? ''}`, [])
    })

}