import {
    CLEAR_PRODUCT_LIST, CLEAR_SKIP, GET_SEARCH_PRODUCTS, SET_GROUP_SEARCH_PRODUCT, SET_SKIP_RECORD
} from '../../../constants/ActionsName';
import DbContext from '../../../DataBase/DataBase';
import {
    PRODUCT_GROUP_TABLE, PRODUCT_GROUP_TABLE_ID, PRODUCT_GROUP_TABLE_NAME, PRODUCTS_TABLE_GROUP,
    PRODUCTS_TABLE_ID, PRODUCTS_TABLE_NAME
} from '../../../DataBase/DataBaseConst';
import { IProduct } from '../../../DataBase/Models/Product';
import { IApplicationAction } from '../../StoreInterfaces';
import { Group } from './Reducer';

export interface SetSkipRecord {
    type: typeof SET_SKIP_RECORD,
    skip: number
}

export interface GetSearchProductsAction {
    type: typeof GET_SEARCH_PRODUCTS
    products: Array<IProduct>
}

export interface SetGroupSearch {
    type: typeof SET_GROUP_SEARCH_PRODUCT
    group: Group
}

export interface ClearStateAction {
    type: typeof CLEAR_PRODUCT_LIST
    payload: null
}
export type AddProductAction = GetSearchProductsAction | ClearStateAction | SetGroupSearch | SetSkipRecord;

export const SetGroupProductSearch = (group: Group): IApplicationAction<SetGroupSearch> => (dispatch, getState) => {

    const state = getState();

    if (state.AddProduct.Category !== group) {
        dispatch({ type: SET_GROUP_SEARCH_PRODUCT, group });
    }
}

export const IncrementSkip = (): IApplicationAction<SetSkipRecord> => (dispatch, getState) => {

    const state = getState().AddProduct.SkipProduct;

    dispatch({ type: SET_SKIP_RECORD, skip: state + 10 })

}

export const ClearSkip = (): IApplicationAction<SetSkipRecord> => (dispatch, getState) => dispatch({ type: SET_SKIP_RECORD, skip: 0 })


export const ClearState = (): IApplicationAction<ClearStateAction> => (dispatch, getState) => {

    const state = getState().AddProduct

    if (state) {

        dispatch({ type: CLEAR_PRODUCT_LIST, payload: null })
    }
}

export const GetSearchProduct = (idProducts: Array<number>, value: string = ''): IApplicationAction<GetSearchProductsAction> => (dispatch, getState) => {

    const state = getState().AddProduct

    if (state) {
        const db = DbContext();

        const products: Array<IProduct> = [];

        let group: string = '';

        if (state.Category !== Group.All) {

            group = `and ${PRODUCTS_TABLE_GROUP} = (select ${PRODUCT_GROUP_TABLE_ID} from ${PRODUCT_GROUP_TABLE} where ${PRODUCT_GROUP_TABLE_NAME} = \'${state.Category.toString()}\')`
        }

        db.transaction(tr => {
            tr.executeSql(`select * from Products where ${PRODUCTS_TABLE_NAME} like ${"\'"}%${value}%${"\'"} and ${PRODUCTS_TABLE_ID} not in (${idProducts.join(',')}) ${group} order by ${PRODUCTS_TABLE_NAME} asc limit 10 offset ${state.SkipProduct}`, [], ((ntr, r) => {

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

