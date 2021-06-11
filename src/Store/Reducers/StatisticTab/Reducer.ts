import moment from "moment";
import { Reducer } from "redux";
import { GET_ALL_STATISTIC_AVG, LABELS_STATISTIC, SET_CURRENT_DATE, SET_FORMAT_DATE } from "../../../constants/ActionsName";
import { LabelsHours, StatisticTabActions } from "./Action";



export enum FormatDate {
    day, week, month, year
}

export interface IStatisticTabState {

    formatDate: FormatDate
    currentOutDate: string
    currentDate: moment.Moment
    statistic: IStatisticData
    labels: any //Array<string>

}

export interface IStatisticData {
    glucose: Array<number>
    yk: Array<number>
    xe: Array<number>
    ygl: Array<number>
    inc: Array<number>
}

//const hours = LabelsHours;

const initState: IStatisticTabState = {
    formatDate: FormatDate.day,
    currentOutDate: moment(new Date()).format('DD MMMM YYYY'),
    currentDate: moment(new Date()),
    statistic: {
        glucose: [],
        inc: [],
        xe: [],
        ygl: [],
        yk: []
    },
    labels: [
        '0:00',
        '1:00',
        '2:00',
        '3:00',
        '4:00',
        '5:00',
        '6:00',
        '7:00',
        '8:00',
        '9:00',
        '10:00',
        '11:00',
        '12:00',
        '13:00',
        '14:00',
        '15:00',
        '16:00',
        '17:00',
        '18:00',
        '19:00',
        '20:00',
        '21:00',
        '22:00',
        '23:00',
    ]
}

export const StatisticTabReducer: Reducer<IStatisticTabState, StatisticTabActions> = (state = initState, action) => {

    switch (action.type) {
        case GET_ALL_STATISTIC_AVG:
            return {
                ...state,
                statistic: action.data
            }

        case SET_FORMAT_DATE:
            return {
                ...state,
                formatDate: action.format
            }

        case SET_CURRENT_DATE:
            return {
                ...state,
                currentDate: action.date,
                currentOutDate: action.outDate
            }
        case LABELS_STATISTIC:
            return {
                ...state,
                labels: action.label
            }

        default:
            return state;
    }
}