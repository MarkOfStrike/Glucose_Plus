import { IFood } from './Food';
import { IProduct } from './Product';

export interface IFoodRecord {
    Product?: IProduct
    Food?: IFood
    NumbersOfGrams?: number
}