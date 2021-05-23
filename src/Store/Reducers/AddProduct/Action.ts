import { PRODUCTS_TABLE_NAME, PRODUCT_GROUP_TABLE, PRODUCT_GROUP_TABLE_NAME, PRODUCT_GROUP_TABLE_ID, PRODUCTS_TABLE_ID } from './../../../DataBase/DataBaseConst';
import { IApplicationAction } from './../../StoreInterfaces';
import { IProduct } from "../../../DataBase/Models/Product";
import DbContext from '../../../DataBase/DataBase';
import { CLEAR_PRODUCT_LIST, GET_SEARCH_PRODUCTS } from '../../../constants/ActionsName';


export interface GetSearchProductsAction {
    type: typeof GET_SEARCH_PRODUCTS
    products: Array<IProduct>
}

export interface ClearStateAction {
    type: typeof CLEAR_PRODUCT_LIST
    payload: null
}
export type AddProductAction = GetSearchProductsAction | ClearStateAction

export const ClearState = ():IApplicationAction<ClearStateAction> => (dispatch, getState) => {
    
    const state = getState().AddProduct

    if (state) {

        dispatch({type: CLEAR_PRODUCT_LIST, payload: null})
    }
}

export const GetSearchProduct = (idProducts:Array<number>,value: string = ''): IApplicationAction<GetSearchProductsAction> => (dispatch, getState) => {

    const state = getState().AddProduct

    if (state) {
        const db = DbContext();

        const products: Array<IProduct> = new Array<IProduct>();

        db.transaction(tr => {

            tr.executeSql(`select * from Products where ${PRODUCTS_TABLE_NAME} like ${"\'"}%${value}%${"\'"} and ${PRODUCTS_TABLE_ID} not in (${idProducts.join(',')})`, [], ((ntr, r) => {

                for (let index = 0; index < r.rows.length; index++) {
                    const element = r.rows.item(index);

                    ntr.executeSql(`select * from ${PRODUCT_GROUP_TABLE} where ${PRODUCT_GROUP_TABLE_ID} = ${element.ProductGroup_Id}`, [], (t, r) => {
                        const group = r.rows.item(0);

                        const product: IProduct = {
                            Id: element.Id,
                            Name: element.Name,
                            Gi: element.GI,
                            Xe: element.XE,
                            Calories: element.Calories,
                            Fats: element.Fats,
                            Proteins: element.Proteins,
                            Carbohydrates: element.Carbohydrates,
                            Group: {
                                Id: group.Id,
                                Name: group.Name
                            }

                        }

                        products.push(product)

                    })

                }

            }))

        }, (error) => {
            console.log(error)
        }, () => {
            // console.log(products);
            dispatch({ type: GET_SEARCH_PRODUCTS, products })
        });


    }
}

