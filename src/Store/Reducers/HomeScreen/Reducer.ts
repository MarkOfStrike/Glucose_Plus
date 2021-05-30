import { Reducer } from "redux"
import { HOME_SCREEN_LOADING_DATA } from "../../../constants/ActionsName"
import { HomeScreenActions } from "./Action"




export interface IHomeScreenState {
    isLoading: boolean
}



const initState: IHomeScreenState = {
    isLoading: true
}

export const HomeScreenReducer: Reducer<IHomeScreenState, HomeScreenActions> = (state = initState, action) => {

    switch (action.type) {
        
        case HOME_SCREEN_LOADING_DATA:
            return{
                ...state,
                isLoading: action.isLoad
            }
    
        default:
            return state
    }

}



