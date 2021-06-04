import { IApplicationAction } from './../../StoreInterfaces';
import { SET_CURRENT_DATE, SET_FORMAT_DATE } from "../../../constants/ActionsName";
import { FormatDate } from "./Reducer";
import moment from 'moment';



const formatDay = 'DD MMMM YYYY';
const formatMonth = 'MMMM YYYY';
const formatYear = 'YYYY';


export interface SetCurrentDateAction {
    type: typeof SET_CURRENT_DATE
    date: Date
    outDate: string
}

export interface SetFormatDateAction {
    type: typeof SET_FORMAT_DATE
    format: FormatDate
}



export type StatisticTabActions = SetCurrentDateAction | SetFormatDateAction;

export const SetDate = (val:number): IApplicationAction<SetCurrentDateAction> => (dispatch, getState) => {

    
    const state = getState();
    const mom = moment(state.StatisticTab.currentDate);

    let newDate = mom;
    let outDate = '';

    switch (state.StatisticTab.formatDate) {
        case FormatDate.day:
            newDate = mom.day(mom.get('day') + val)
            outDate = newDate.format(formatDay);
            break;
        case FormatDate.week:
            newDate = mom.day(mom.get('day') + (7*val))
            const momDate = newDate.locale('ru').startOf('isoWeek');

            const start = momDate;
            const end = momDate.days(7);

            outDate = `${start.format(formatDay)} - ${end.format(formatDay)}`;
            break;
        case FormatDate.month:
            newDate = mom.month(mom.get('month') + val)
            outDate = newDate.format(formatMonth);
            break;
        case FormatDate.year:
            newDate = mom.year(mom.get('year') + val)
            outDate = `${newDate.format(formatYear)}г.`;
            break;

        default:
            break;
    }

    dispatch({ type: SET_CURRENT_DATE, date: newDate.toDate(), outDate });

}


export const SetFormat = (format:FormatDate):IApplicationAction<SetFormatDateAction> => (dispatch, getState) => dispatch({type:SET_FORMAT_DATE, format})

