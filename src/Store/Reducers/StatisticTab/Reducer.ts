import moment from "moment";
import { Reducer } from "redux";
import { StatisticTabActions } from "./Action";



export enum FormatDate {
    day,week,month,year
}

export interface IStatisticTabState {
    
    formatDate: FormatDate
    currentOutDate: string
    currentDate: moment.Moment

}

const initState:IStatisticTabState = {
    formatDate: FormatDate.day,
    currentOutDate:'',
    currentDate: moment(new Date())
}

export const StatisticTabReducer:Reducer<IStatisticTabState, StatisticTabActions> = (state = initState, action) => {

    return state

}