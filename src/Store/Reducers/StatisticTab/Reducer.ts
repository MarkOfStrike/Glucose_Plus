import moment from "moment";
import { Reducer } from "redux";
import { GET_ALL_STATISTIC_AVG, LABELS_STATISTIC, SET_CURRENT_DATE, SET_FORMAT_DATE } from "../../../constants/ActionsName";
import { StatisticTabActions } from "./Action";



export enum FormatDate {
    day,week,month,year
}

export interface IStatisticTabState {
    
    formatDate: FormatDate
    currentOutDate: string
    currentDate: moment.Moment
    statistic: IStatisticData
    labels: Array<string>

}

export interface IStatisticData {
    glucose: Array<number>
    yk: Array<number>
    xe: Array<number>
    ygl: Array<number>
    inc: Array<number>
}

const initState:IStatisticTabState = {
    formatDate: FormatDate.day,
    currentOutDate:moment(new Date()).format('DD MMMM YYYY'),
    currentDate: moment(new Date()),
    statistic: {
        glucose:[],
        inc:[],
        xe:[],
        ygl:[],
        yk:[]
    },
    labels:[]
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