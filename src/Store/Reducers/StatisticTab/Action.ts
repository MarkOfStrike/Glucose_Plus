import moment from 'moment';

import {
    GET_ALL_STATISTIC_AVG, LABELS_STATISTIC, SET_CURRENT_DATE, SET_FORMAT_DATE
} from '../../../constants/ActionsName';
import DbContext from '../../../DataBase/DataBase';
import {
    FOOD_RECORD_TABLE, FOOD_TABLE, FOOD_TABLE_CARBOHYDRATE_RATIO, FOOD_TABLE_DATE_ADD,
    FOOD_TABLE_ID, FOOD_TABLE_INSULIN, GLUCOSE_MEASUREMENT_TABLE,
    GLUCOSE_MEASUREMENT_TABLE_DATE_ADD, GLUCOSE_MEASUREMENT_TABLE_LEVEL, PRODUCTS_TABLE,
    PRODUCTS_TABLE_CALORIES, PRODUCTS_TABLE_CARBOHYDRATES, PRODUCTS_TABLE_FATS, PRODUCTS_TABLE_GI,
    PRODUCTS_TABLE_PROTEINS, PRODUCTS_TABLE_XE
} from '../../../DataBase/DataBaseConst';
import { IApplicationAction } from '../../StoreInterfaces';
import { FormatDate, IStatisticData } from './Reducer';

const formatDay = 'DD MMMM YYYY';
const formatMonth = 'MMMM YYYY';
const formatYear = 'YYYY';


export interface SetLabelsAction {
    type: typeof LABELS_STATISTIC
    label: Array<string>
}

export interface SetCurrentDateAction {
    type: typeof SET_CURRENT_DATE
    date: moment.Moment
    outDate: string
}

export interface SetFormatDateAction {
    type: typeof SET_FORMAT_DATE
    format: FormatDate
    labels: Array<string>
}



export interface GetDataStatisticAction {
    type: typeof GET_ALL_STATISTIC_AVG
    data: IStatisticData
}


export type StatisticTabActions = SetCurrentDateAction | SetFormatDateAction | GetDataStatisticAction | SetLabelsAction;

interface ITime {
    start: number
    end: number
}

// export const SetFormat = (format: FormatDate): IApplicationAction<StatisticTabActions> => (dispatch, getState) => {

//     const current = getState().StatisticTab.currentDate;

//     let labels:Array<string> = [] 

//     switch (format) {
//         case FormatDate.day:
//             labels = LabelsHours();
//             break;
//             case FormatDate.week:
//             labels = Week;
//             break;
//         case FormatDate.month:
//             labels = LabelsDays(current.daysInMonth());
//             break;
//         case FormatDate.year:
//             labels = Months;
//             break;

//         default:
//             break;
//     }

//     return TAllRequest([{ type: SET_FORMAT_DATE, format, labels }]);
// }

// export const SetDate = (val: number): IApplicationAction<StatisticTabActions> => (dispatch, getState) => {

//     const state = getState();
//     const mom = state.StatisticTab.currentDate;

//     let newDate = mom;
//     let outDate = '';

//     switch (state.StatisticTab.formatDate) {
//         case FormatDate.day:
//             newDate = mom.day(mom.get('day') + val)
//             outDate = newDate.format(formatDay);
//             break;
//         case FormatDate.week:
//             newDate = mom.day(mom.get('day') + (7 * val))
//             const momDate = newDate.clone().locale('ru').startOf('isoWeek');

//             const start = momDate;
//             const end = start.clone().add(7, 'days');

//             outDate = `${start.format(formatDay)} - ${end.format(formatDay)}`;
//             break;
//         case FormatDate.month:
//             newDate = mom.month(mom.get('month') + val)
//             outDate = newDate.format(formatMonth);
//             break;
//         case FormatDate.year:
//             newDate = mom.year(mom.get('year') + val)
//             outDate = `${newDate.format(formatYear)}г.`;
//             break;

//         default:
//             break;
//     }

//     const arr:Array<StatisticTabActions> = [
//          { type: SET_CURRENT_DATE, date: newDate, outDate } 
//     ]

//     if (state.StatisticTab.formatDate === FormatDate.month) {
//         arr.push(
//             { type: LABELS_STATISTIC, label: LabelsDays(newDate.daysInMonth()) }
//         )
//     }

//     return TAllRequest(arr);
// }


// const TAllRequest = (disp: Array<StatisticTabActions>): IApplicationAction<any> => (dispatch, getState) => {

//     const state = getState().StatisticTab;

//     if (state) {

//         const ar = disp.map((v,i) => dispatch(v));

//         const request = dispatch(GetData());
//         Promise.all([ar, request]);
//     }
// }

interface ITestArr {
    start: number,
    end: number
}

const TEST = () => {


    const arr: Array<ITestArr> = []


}

export const GetData = (): IApplicationAction<GetDataStatisticAction> => (dispatch, getState) => {

    const state = getState();
    const db = DbContext();

    const data: IStatisticData = {
        glucose: [],
        yk: [],
        xe: [],
        ygl: [],
        inc: [],
        gi: [],
        fats: [],
        proteins: [],
        calories: [],
    }

    const currentTime = state.StatisticTab.currentDate.locale('ru');

    const time: Array<ITime> = [];




    switch (state.StatisticTab.formatDate) {
        case FormatDate.day:
            // time.push({
            //     start: Date.parse(new Date(currentTime.get('year'), currentTime.get('month'), currentTime.get('day'), 0, 0, 0).toString()),
            //     end: Date.parse(new Date(currentTime.get('year'), currentTime.get('month'), currentTime.get('day'), 23, 59, 59).toString())
            // });
            time.push({
                start: currentTime.toDate().setHours(0, 0, 0, 0),
                end: currentTime.toDate().setHours(23, 59, 59, 0)
            });
            break;

        case FormatDate.week:

            const startWeek = currentTime.clone().startOf('isoWeek');
            time.push({
                start: startWeek.toDate().setHours(0, 0, 0, 0),
                end: startWeek.toDate().setHours(23, 59, 59, 0)
            })
            for (let index = 0; index < 6; index++) {

                const newDate = startWeek.add(1, 'days');

                time.push({
                    start: newDate.toDate().setHours(0, 0, 0, 0),
                    end: newDate.toDate().setHours(23, 59, 59, 0)
                })

            }
            break;

        case FormatDate.month:

            for (let index = 1; index <= currentTime.daysInMonth(); index++) {
                time.push({
                    start: Date.parse(new Date(currentTime.get('year'), currentTime.get('month'), index, 0, 0, 0).toString()),
                    end: Date.parse(new Date(currentTime.get('year'), currentTime.get('month'), index, 23, 59, 59).toString())
                })
            }
            break;

        case FormatDate.year:

            for (let index = 1; index <= 12; index++) {

                time.push({
                    start: Date.parse(new Date(currentTime.get('year'), index, 1, 0, 0, 0).toString()),
                    end: Date.parse(new Date(currentTime.get('year'), index, moment(new Date()).month(index).daysInMonth(), 23, 59, 59).toString())
                })

            }
            break;

        default:
            break;
    }



    const queryArr: Array<{ queryGlucose: string, queryAvgFood: string, queryAvgProduct: string }> = []

    if (state.StatisticTab.formatDate == FormatDate.day) {

        queryArr.push({
            queryGlucose: `select ${GLUCOSE_MEASUREMENT_TABLE_LEVEL} from ${GLUCOSE_MEASUREMENT_TABLE} where ${GLUCOSE_MEASUREMENT_TABLE_DATE_ADD} > ${time[0].start} and ${GLUCOSE_MEASUREMENT_TABLE_DATE_ADD} < ${time[0].end}`,
            queryAvgFood: `select avg(${FOOD_TABLE_INSULIN}) as avgInc, avg(${FOOD_TABLE_CARBOHYDRATE_RATIO}) as avgRatio from ${FOOD_TABLE} where ${FOOD_TABLE_DATE_ADD} > ${time[0].start} and ${FOOD_TABLE_DATE_ADD} < ${time[0].end}`,
            queryAvgProduct: `select ${FOOD_TABLE_ID} from ${FOOD_TABLE} where ${FOOD_TABLE_DATE_ADD} > ${time[0].start} and ${FOOD_TABLE_DATE_ADD} < ${time[0].end}`
        })

    } else {

        time.forEach((v, i) => {
            queryArr.push({
                queryGlucose: `select ${GLUCOSE_MEASUREMENT_TABLE_LEVEL} from ${GLUCOSE_MEASUREMENT_TABLE} where ${GLUCOSE_MEASUREMENT_TABLE_DATE_ADD} > ${v.start} and ${GLUCOSE_MEASUREMENT_TABLE_DATE_ADD} < ${v.end}`,
                queryAvgFood: `select avg(${FOOD_TABLE_INSULIN}) as avgInc, avg(${FOOD_TABLE_CARBOHYDRATE_RATIO}) as avgRatio from ${FOOD_TABLE} where ${FOOD_TABLE_DATE_ADD} > ${v.start} and ${FOOD_TABLE_DATE_ADD} < ${v.end}`,
                queryAvgProduct: `select ${FOOD_TABLE_ID} from ${FOOD_TABLE} where ${FOOD_TABLE_DATE_ADD} > ${v.start} and ${FOOD_TABLE_DATE_ADD} < ${v.end}`
            })
        })

    }

    db.transaction(tr => {

        queryArr.forEach((v, i) => {
            tr.executeSql(v.queryGlucose, [], (t, r) => {

                for (let index = 0; index < r.rows.length; index++) {
                    const level = r.rows.item(index);
                    data.glucose.push(level[GLUCOSE_MEASUREMENT_TABLE_LEVEL] as number);
                }

            })

            tr.executeSql(v.queryAvgFood, [], (t, r) => {

                if (r.rows.length > 0) {
                    const level = r.rows.item(0);

                    if (level['avgInc'] && level['avgRatio']) {
                        data.inc.push(level['avgInc'] as number);
                        data.yk.push(level['avgRatio'] as number);
                    }
                }
            })

            tr.executeSql(v.queryAvgProduct, [], (t, r) => {

                const ids: Array<number> = []

                for (let index = 0; index < r.rows.length; index++) {
                    const id = r.rows.item(index).Id;
                    ids.push(id as number);
                }

                if (ids.length > 0) {
                    t.executeSql(`select avg(p.${PRODUCTS_TABLE_CARBOHYDRATES}) as ygl, avg(p.${PRODUCTS_TABLE_XE}) as xe from ${FOOD_RECORD_TABLE} fr join ${PRODUCTS_TABLE} p on p.Id = fr.Product_Id where fr.Food_Id in (${ids.join(',')})`, [], (n, res) => {

                        if (res.rows.length > 0) {
                            const values = res.rows.item(0)

                            if (values.ygl && values.xe) {
                                data.ygl.push(values.ygl as number);
                                data.xe.push(values.xe as number);
                            }
                        }

                    })
                }

            })
        })


    }, error => {
        console.log(error);
    }, () => {
        dispatch({ type: GET_ALL_STATISTIC_AVG, data });
    })


}

interface IStatisticDataTest {
    glucose: Array<number>
    yk: Array<number>
    xe: Array<number>
    ygl: Array<number>
    inc: Array<number>
    gi: Array<number>
    fats: Array<number>
    proteins: Array<number>
    calories: Array<number>
}

export const GetDataTest = (): IApplicationAction<GetDataStatisticAction> => (dispatch, getState) => {

    const state = getState();
    const db = DbContext();

    const data: IStatisticData = {
        glucose: [],
        yk: [],
        xe: [],
        ygl: [],
        inc: [],
        gi: [],
        fats: [],
        proteins: [],
        calories: [],
    }

    const currentTime = state.StatisticTab.currentDate.clone().locale('ru');

    const time: Array<ITime> = [];




    switch (state.StatisticTab.formatDate) {
        case FormatDate.day:
            for (let hour = 0; hour < 24; hour++) {
                time.push({
                    start: currentTime.toDate().setHours(hour, 0, 0),
                    end: currentTime.toDate().setHours(hour, 59, 59)
                });
            }
            break;

        case FormatDate.week:

            const startWeek = currentTime.clone().startOf('isoWeek');

            for (let index = 0; index < 8; index++) {
                const date = startWeek.clone().add(index, 'day');
                time.push({
                    start: date.toDate().setHours(0, 0, 0, 0),
                    end: date.toDate().setHours(23, 59, 59, 0)
                })
            }

            break;

        case FormatDate.month:

            for (let index = 1; index <= currentTime.daysInMonth(); index++) {
                const today = moment(new Date(currentTime.toDate().setDate(index)));
                time.push({
                    start: today.toDate().setHours(0, 0, 0),
                    end: today.toDate().setHours(23, 59, 59)
                })
            }
            break;

        case FormatDate.year:

            for (let index = 1; index <= 12; index++) {
                const startMonth = moment(new Date(currentTime.get('year'), index, 1));
                const endMonth = moment(new Date(currentTime.get('year'), index, startMonth.daysInMonth()));
                // const today = moment(new Date(currentDate.toDate().setDate(index)));
                time.push({
                    start: startMonth.toDate().setHours(0, 0, 0),
                    end: endMonth.toDate().setHours(23, 59, 59)
                })
            }

            break;

        default:
            break;
    }



    const queryArr: Array<{ queryGlucose: string, queryAvgFood: string, queryAvgProduct: string }> = []

    time.forEach((v, i) => {
        queryArr.push({
            queryGlucose: `select avg(${GLUCOSE_MEASUREMENT_TABLE_LEVEL}) as lev from ${GLUCOSE_MEASUREMENT_TABLE} where ${GLUCOSE_MEASUREMENT_TABLE_DATE_ADD} > ${v.start} and ${GLUCOSE_MEASUREMENT_TABLE_DATE_ADD} < ${v.end}`,
            queryAvgFood: `select avg(${FOOD_TABLE_INSULIN}) as avgInc, avg(${FOOD_TABLE_CARBOHYDRATE_RATIO}) as avgRatio from ${FOOD_TABLE} where ${FOOD_TABLE_DATE_ADD} > ${v.start} and ${FOOD_TABLE_DATE_ADD} < ${v.end}`,
            // queryAvgProduct: `select ${FOOD_TABLE_ID} from ${FOOD_TABLE} where ${FOOD_TABLE_DATE_ADD} > ${v.start} and ${FOOD_TABLE_DATE_ADD} < ${v.end}`,
            queryAvgProduct: `select avg(p.${PRODUCTS_TABLE_XE}) as xe,avg(p.${PRODUCTS_TABLE_GI}) as gi, avg(p.${PRODUCTS_TABLE_FATS}) as f,avg(p.${PRODUCTS_TABLE_PROTEINS}) as p,avg(p.${PRODUCTS_TABLE_CARBOHYDRATES}) as car,avg(p.${PRODUCTS_TABLE_CALORIES}) as cal from ${FOOD_TABLE} f ` +
                `join FoodRecords fr on fr.Food_Id = f.Id join Products p on p.Id = fr.Product_Id ` +
                `where ${FOOD_TABLE_DATE_ADD} > ${v.start} and ${FOOD_TABLE_DATE_ADD} < ${v.end} order by ${FOOD_TABLE_DATE_ADD} asc`
        })
    })

    db.transaction(tr => {

        queryArr.forEach((v, i) => {
            tr.executeSql(v.queryGlucose, [], (t, r) => {

                const level = r.rows.item(0)
                data.glucose.push((level['lev'] ?? 0) as number);

            })

            tr.executeSql(v.queryAvgFood, [], (t, r) => {

                if (r.rows.length > 0) {
                    const level = r.rows.item(0);

                    data.inc.push((level['avgInc'] ?? 0) as number);
                    data.yk.push((level['avgRatio'] ?? 0) as number);


                }
            })

            tr.executeSql(v.queryAvgProduct, [], (t, r) => {

                for (let row = 0; row < r.rows.length; row++) {
                    const element = r.rows.item(row);

                    data.xe.push((element['xe'] ?? 0) as number);
                    data.gi.push((element['gi'] ?? 0) as number);
                    data.fats.push((element['f'] ?? 0) as number);
                    data.proteins.push((element['p'] ?? 0) as number);
                    data.calories.push((element['cal'] ?? 0) as number);
                    data.ygl.push((element['car'] ?? 0) as number);


                }
            })

        })

    }, error => {
        console.log(error);
    }, () => {
        dispatch({ type: GET_ALL_STATISTIC_AVG, data: data });
    })


}


const DayData = (currentDate: moment.Moment) => {

    const db = DbContext();

    const outArr = {
        a: [] as Array<any>,
        b: [] as Array<any>,
        c: [] as Array<any>,
        d: [] as Array<any>,
        e: [] as Array<any>,
        f: [] as Array<any>,
    }

    db.transaction(tr => {

        for (let hour = 0; hour < 24; hour++) {
            const start = currentDate.toDate().setHours(hour, 0, 0);
            const end = currentDate.toDate().setHours(hour, 59, 59);

            tr.executeSql(
                `select avg(p.${PRODUCTS_TABLE_XE}) as xe,avg(p.${PRODUCTS_TABLE_GI}) as gi, avg(p.${PRODUCTS_TABLE_FATS}) as f,avg(p.${PRODUCTS_TABLE_PROTEINS}) as p,avg(p.${PRODUCTS_TABLE_CARBOHYDRATES}) as car,avg(p.${PRODUCTS_TABLE_CALORIES}) as cal from ${FOOD_TABLE} f ` +
                `join FoodRecords fr on fr.Food_Id = f.Id join Products p on p.Id = fr.Product_Id ` +
                `where ${FOOD_TABLE_DATE_ADD} > ${start} and ${FOOD_TABLE_DATE_ADD} < ${end}`, [], (t, r) => {

                    if (r.rows.length > 0) {

                        for (let row = 0; row < r.rows.length; row++) {
                            const element = r.rows.item(row);

                            const a = element['xe'];
                            const b = element['gi'];
                            const c = element['f'];
                            const d = element['p'];
                            const e = element['car'];
                            const f = element['cal'];

                            outArr.a.push(a);
                            outArr.b.push(b);
                            outArr.c.push(c);
                            outArr.d.push(d);
                            outArr.e.push(e);
                            outArr.f.push(f);



                        }

                    }
                    else {
                        outArr.a.push(0);
                        outArr.b.push(0);
                        outArr.c.push(0);
                        outArr.d.push(0);
                        outArr.e.push(0);
                        outArr.f.push(0);
                    }

                })
        }


    }, error => {
        console.log(error);
    }, () => {

    })

    return outArr;


}

const WeekData = (currentDate: moment.Moment) => {

    const db = DbContext();

    const outArr = {
        a: [] as Array<any>,
        b: [] as Array<any>,
        c: [] as Array<any>,
        d: [] as Array<any>,
        e: [] as Array<any>,
        f: [] as Array<any>,
    }

    db.transaction(tr => {

        for (let index = 0; index < 8; index++) {
            const date = currentDate.clone().add(index, 'day');
            const start = date.toDate().setHours(0, 0, 0);
            const end = date.toDate().setHours(23, 59, 59);

            tr.executeSql(
                `select avg(p.${PRODUCTS_TABLE_XE}) as xe,avg(p.${PRODUCTS_TABLE_GI}) as gi, avg(p.${PRODUCTS_TABLE_FATS}) as f,avg(p.${PRODUCTS_TABLE_PROTEINS}) as p,avg(p.${PRODUCTS_TABLE_CARBOHYDRATES}) as car,avg(p.${PRODUCTS_TABLE_CALORIES}) as cal from ${FOOD_TABLE} f ` +
                `join FoodRecords fr on fr.Food_Id = f.Id join Products p on p.Id = fr.Product_Id ` +
                `where ${FOOD_TABLE_DATE_ADD} > ${start} and ${FOOD_TABLE_DATE_ADD} < ${end}`, [], (t, r) => {

                    if (r.rows.length > 0) {

                        for (let row = 0; row < r.rows.length; row++) {
                            const element = r.rows.item(row);

                            const a = element['xe'];
                            const b = element['gi'];
                            const c = element['f'];
                            const d = element['p'];
                            const e = element['car'];
                            const f = element['cal'];

                            outArr.a.push(a);
                            outArr.b.push(b);
                            outArr.c.push(c);
                            outArr.d.push(d);
                            outArr.e.push(e);
                            outArr.f.push(f);

                        }

                    }
                    else {
                        outArr.a.push(0);
                        outArr.b.push(0);
                        outArr.c.push(0);
                        outArr.d.push(0);
                        outArr.e.push(0);
                        outArr.f.push(0);
                    }

                })
        }


    }, error => {
        console.log(error);
    }, () => {

    })

    return outArr;

}

const MonthData = (currentDate: moment.Moment) => {

    for (let index = 1; index <= currentDate.daysInMonth(); index++) {
        const today = moment(new Date(currentDate.toDate().setDate(index)));

    }

    const db = DbContext();

    const outArr = {
        a: [] as Array<any>,
        b: [] as Array<any>,
        c: [] as Array<any>,
        d: [] as Array<any>,
        e: [] as Array<any>,
        f: [] as Array<any>,
    }

    db.transaction(tr => {

        for (let index = 1; index <= currentDate.daysInMonth(); index++) {
            const today = moment(new Date(currentDate.toDate().setDate(index)));
            const start = today.toDate().setHours(0, 0, 0);
            const end = today.toDate().setHours(23, 59, 59);

            tr.executeSql(
                `select avg(p.${PRODUCTS_TABLE_XE}) as xe,avg(p.${PRODUCTS_TABLE_GI}) as gi, avg(p.${PRODUCTS_TABLE_FATS}) as f,avg(p.${PRODUCTS_TABLE_PROTEINS}) as p,avg(p.${PRODUCTS_TABLE_CARBOHYDRATES}) as car,avg(p.${PRODUCTS_TABLE_CALORIES}) as cal from ${FOOD_TABLE} f ` +
                `join FoodRecords fr on fr.Food_Id = f.Id join Products p on p.Id = fr.Product_Id ` +
                `where ${FOOD_TABLE_DATE_ADD} > ${start} and ${FOOD_TABLE_DATE_ADD} < ${end}`, [], (t, r) => {

                    if (r.rows.length > 0) {

                        for (let row = 0; row < r.rows.length; row++) {
                            const element = r.rows.item(row);

                            const a = element['xe'];
                            const b = element['gi'];
                            const c = element['f'];
                            const d = element['p'];
                            const e = element['car'];
                            const f = element['cal'];

                            outArr.a.push(a);
                            outArr.b.push(b);
                            outArr.c.push(c);
                            outArr.d.push(d);
                            outArr.e.push(e);
                            outArr.f.push(f);

                        }

                    }
                    else {
                        outArr.a.push(0);
                        outArr.b.push(0);
                        outArr.c.push(0);
                        outArr.d.push(0);
                        outArr.e.push(0);
                        outArr.f.push(0);
                    }

                })
        }


    }, error => {
        console.log(error);
    }, () => {

    })

    return outArr;


}



const YearData = (currentDate: moment.Moment) => {


    for (let index = 1; index <= currentDate.daysInMonth(); index++) {
        const today = moment(new Date(currentDate.toDate().setDate(index)));

    }

    const db = DbContext();

    const outArr = {
        a: [] as Array<any>,
        b: [] as Array<any>,
        c: [] as Array<any>,
        d: [] as Array<any>,
        e: [] as Array<any>,
        f: [] as Array<any>,
    }

    db.transaction(tr => {

        for (let index = 1; index <= 12; index++) {
            const cur = moment(new Date(currentDate.get('year'), index, 1));
            const ads = moment(new Date(currentDate.get('year'), index, cur.daysInMonth()));
            // const today = moment(new Date(currentDate.toDate().setDate(index)));
            const start = cur.toDate().setHours(0, 0, 0);
            const end = ads.toDate().setHours(23, 59, 59);

            tr.executeSql(
                `select avg(p.${PRODUCTS_TABLE_XE}) as xe,avg(p.${PRODUCTS_TABLE_GI}) as gi, avg(p.${PRODUCTS_TABLE_FATS}) as f,avg(p.${PRODUCTS_TABLE_PROTEINS}) as p,avg(p.${PRODUCTS_TABLE_CARBOHYDRATES}) as car,avg(p.${PRODUCTS_TABLE_CALORIES}) as cal from ${FOOD_TABLE} f ` +
                `join FoodRecords fr on fr.Food_Id = f.Id join Products p on p.Id = fr.Product_Id ` +
                `where ${FOOD_TABLE_DATE_ADD} > ${start} and ${FOOD_TABLE_DATE_ADD} < ${end} order by ${FOOD_TABLE_DATE_ADD} asc`, [], (t, r) => {

                    if (r.rows.length > 0) {

                        for (let row = 0; row < r.rows.length; row++) {
                            const element = r.rows.item(row);

                            const a = element['xe'];
                            const b = element['gi'];
                            const c = element['f'];
                            const d = element['p'];
                            const e = element['car'];
                            const f = element['cal'];

                            outArr.a.push(a);
                            outArr.b.push(b);
                            outArr.c.push(c);
                            outArr.d.push(d);
                            outArr.e.push(e);
                            outArr.f.push(f);

                        }

                    }
                    else {
                        outArr.a.push(0);
                        outArr.b.push(0);
                        outArr.c.push(0);
                        outArr.d.push(0);
                        outArr.e.push(0);
                        outArr.f.push(0);
                    }

                })
        }


    }, error => {
        console.log(error);
    }, () => {

    })

    return outArr;

}


export const SetDate = (val: number): IApplicationAction<StatisticTabActions> => (dispatch, getState) => {


    const state = getState();
    const mom = state.StatisticTab.currentDate;

    let newDate = mom;
    let outDate = '';

    switch (state.StatisticTab.formatDate) {
        case FormatDate.day:
            newDate = mom.day(mom.get('day') + val)
            outDate = newDate.format(formatDay);
            break;
        case FormatDate.week:
            newDate = mom.day(mom.get('day') + (7 * val))
            const momDate = newDate.clone().locale('ru').startOf('isoWeek');

            const start = momDate;
            const end = start.clone().add(7, 'days');

            outDate = `${start.format(formatDay)} - ${end.format(formatDay)}`;
            dispatch({ type: LABELS_STATISTIC, label: LabelsWeek(start.clone()) })
            break;
        case FormatDate.month:
            newDate = mom.month(mom.get('month') + val)
            outDate = newDate.format(formatMonth);
            dispatch({ type: LABELS_STATISTIC, label: LabelsDays(newDate.daysInMonth()) })
            break;
        case FormatDate.year:
            newDate = mom.year(mom.get('year') + val)
            outDate = `${newDate.format(formatYear)}г.`;
            break;

        default:
            break;
    }

    dispatch({ type: SET_CURRENT_DATE, date: newDate, outDate });

}


export const SetFormat = (format: FormatDate): IApplicationAction<StatisticTabActions> => (dispatch, getState) => {



    switch (format) {
        case FormatDate.day:
            dispatch({ type: LABELS_STATISTIC, label: LabelsHours() })
            break;
        case FormatDate.year:
            dispatch({ type: LABELS_STATISTIC, label: LabelsMonths() })
            break;

        default:
            break;
    }

    const mom = moment(new Date());


    let newDate = mom;
    let outDate = '';

    switch (format) {
        case FormatDate.day:
            outDate = newDate.format(formatDay);
            break;
        case FormatDate.week:
            const momDate = newDate.clone().locale('ru').startOf('isoWeek');

            const start = momDate;
            const end = start.clone().add(7, 'days');

            outDate = `${start.format(formatDay)} - ${end.format(formatDay)}`;
            dispatch({ type: LABELS_STATISTIC, label: LabelsWeek(start.clone()) })
            break;
        case FormatDate.month:
            outDate = newDate.format(formatMonth);
            dispatch({ type: LABELS_STATISTIC, label: LabelsDays(newDate.daysInMonth()) })
            break;
        case FormatDate.year:
            outDate = `${newDate.format(formatYear)}г.`;
            break;

        default:
            break;
    }

    dispatch({ type: SET_CURRENT_DATE, date: newDate, outDate });
    dispatch({ type: SET_FORMAT_DATE, format, labels: [] });

}


export const LabelsHours = () => {

    const arr: Array<string> = [];
    for (let index = 0; index < 24; index++) {
        arr.push(`${index}:00`);
    }
    return arr;

}

const LabelsDays = (countDays: number) => {

    const arr: Array<string> = [];
    for (let index = 1; index <= countDays + 1; index++) {
        arr.push(`${index}`);
    }
    return arr;

}

const LabelsWeeks = (startDays: number, endDays: number) => {

    const arr: Array<string> = [];
    for (let index = startDays; index <= endDays + 1; index++) {
        arr.push(`${index}`);
    }
    return arr;

}

const LabelsWeek = (start: moment.Moment) => {

    const arr: Array<string> = [start.date().toString()];
    for (let index = 0; index < 6; index++) {
        arr.push(`${start.add(1, 'days').date()}`);
    }
    return arr;

}

const Week: Array<string> = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const Months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'];


const LabelsMonths = () => [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'];
