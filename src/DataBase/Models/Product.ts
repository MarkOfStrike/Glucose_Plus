import { IGroup } from "./ProductGroup";

export interface IProduct {
    Id?: number
    Name?: string
    Gi?: number
    Xe?: number
    Fats?: number
    Proteins?: number
    Carbohydrates?: number
    Calories?: number
    Group?: IGroup
}