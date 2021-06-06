import { FOOD_TABLE, FOOD_TABLE_CARBOHYDRATE_RATIO, FOOD_TABLE_DATE_ADD, FOOD_TABLE_INSULIN, FOOD_TABLE_ID, PRODUCTS_TABLE_CARBOHYDRATES, PRODUCTS_TABLE_XE, PRODUCTS_TABLE, FOOD_RECORD_TABLE } from './../../../DataBase/DataBaseConst';
import { GET_ALL_STATISTIC_AVG, LABELS_STATISTIC } from './../../../constants/ActionsName';
import { IApplicationAction } from './../../StoreInterfaces';
import { SET_CURRENT_DATE, SET_FORMAT_DATE } from "../../../constants/ActionsName";
import { FormatDate, IStatisticData } from "./Reducer";
import moment from 'moment';
import DbContext from '../../../DataBase/DataBase';
import { GLUCOSE_MEASUREMENT_TABLE, GLUCOSE_MEASUREMENT_TABLE_DATE_ADD, GLUCOSE_MEASUREMENT_TABLE_LEVEL } from '../../../DataBase/DataBaseConst';



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

export const GetData = (): IApplicationAction<GetDataStatisticAction> => (dispatch, getState) => {

    const state = getState();
    const db = DbContext();

    const data: IStatisticData = {
        glucose: [],
        inc: [],
        xe: [],
        ygl: [],
        yk: []
    }

    const currentTime = state.StatisticTab.currentDate.locale('ru');

    const time: Array<ITime> = [];

    switch (state.StatisticTab.formatDate) {
        case FormatDate.day:
            time.push({
                start: Date.parse(new Date(currentTime.get('year'), currentTime.get('month'), currentTime.get('day'), 0, 0, 0).toString()),
                end: Date.parse(new Date(currentTime.get('year'), currentTime.get('month'), currentTime.get('day'), 23, 59, 59).toString())
            });
            break;

        case FormatDate.week:

            const startWeek = currentTime.clone().startOf('isoWeek');
            time.push({
                start: Date.parse(new Date(startWeek.get('year'), startWeek.get('month'), startWeek.get('day'), 0, 0, 0).toString()),
                end: Date.parse(new Date(startWeek.get('year'), startWeek.get('month'), startWeek.get('day'), 23, 59, 59).toString())
            })
            for (let index = 0; index < 6; index++) {

                const newDate = startWeek.add(1, 'days');

                time.push({
                    start: Date.parse(new Date(newDate.get('year'), newDate.get('month'), newDate.get('day'), 0, 0, 0).toString()),
                    end: Date.parse(new Date(newDate.get('year'), newDate.get('month'), newDate.get('day'), 23, 59, 59).toString())
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
            dispatch({ type: LABELS_STATISTIC, label: LabelsWeeks(start.get('day'), end.get('day')) })
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

    dispatch({ type: SET_FORMAT_DATE, format })

}


const LabelsHours = () => {

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
