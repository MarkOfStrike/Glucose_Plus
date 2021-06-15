import { Reducer } from "react";
import { CLEAR_PRODUCT_LIST, CLEAR_SKIP, GET_SEARCH_PRODUCTS, SET_GROUP_SEARCH_PRODUCT, SET_SKIP_RECORD } from "../../../constants/ActionsName";
import { IProduct } from "../../../DataBase/Models/Product";
import { AddProductAction } from "./Action";

export interface IAddProductState {
    ProductsList: Array<IProduct>
    Category: Group
    SkipProduct: number
}

export enum Group {
    All = 'Все',
    Legumes = 'Бобовые',
    Mushrooms = 'Грибы',
    Fats_margarine_oil = 'Жиры, маргарин, масло',
    Caviar = 'Икра',
    Sausage_and_sausage_products = 'Колбаса и колбасные изделия',
    Cereals = 'Крупы',
    Milk_and_dairy_products = 'Молоко и молочные продукты',
    Canned_meat_and_smoked_meats = 'Мясные консервы и копчености',
    Meat_byproducts_poultry = 'Мясо, субпродукты, птица',
    Vegetables = 'Овощи',
    Nuts = 'Орехи',
    Fish_and_seafood = 'Рыба и морепродукты',
    Sweets = 'Сладости',
    Dried_fruits = 'Сухофрукты',
    Fruits_and_berries = 'Фрукты и ягоды',
    Bread_and_bakery_products_flour = 'Хлеб, хлебобулочные изделия, мука',
    Eggs = 'Яйца'
}

const initState: IAddProductState = {
    ProductsList: [],
    Category: Group.All,
    SkipProduct: 0
}

export const AddProductReducer: Reducer<IAddProductState, AddProductAction> = (state = initState, action): IAddProductState => {

    switch (action.type) {

        case GET_SEARCH_PRODUCTS:
            const newList = state.SkipProduct === 0 ? action.products : [...state.ProductsList, ...action.products] as Array<IProduct>;

            return {
                ...state,
                ProductsList: newList
            }
        case CLEAR_PRODUCT_LIST:
            return {
                ...initState
            }
        case SET_GROUP_SEARCH_PRODUCT:
            return {
                ...state,
                Category: action.group
            }
        case SET_SKIP_RECORD:
            return {
                ...state,
                SkipProduct: action.skip
            }

        default:
            return state
    }

}