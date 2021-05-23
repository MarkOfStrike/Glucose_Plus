import { Reducer } from "react";
import { CLEAR_PRODUCT_LIST, GET_SEARCH_PRODUCTS } from "../../../constants/ActionsName";
import { IProduct } from "../../../DataBase/Models/Product";
import { AddProductAction } from "./Action";

export interface IAddProductState {
    ProductsList: Array<IProduct>
}

const initState: IAddProductState = {
    ProductsList: []
}

export const AddProductReducer: Reducer<IAddProductState, AddProductAction> = (state = initState, action):IAddProductState => {

    switch (action.type) {
        
        case GET_SEARCH_PRODUCTS:
            return {
                ProductsList: action.products
            }
        case CLEAR_PRODUCT_LIST:
                return{
                    ...initState
                }

        default:
            return state
    }

}