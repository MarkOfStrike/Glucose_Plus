import { IFood } from "../DataBase/Models/Food";
import { IGlucoseMeasurement } from "../DataBase/Models/GlucoseMeasurement";
import { IProduct } from "../DataBase/Models/Product";
import { IDictionary } from "./IDictionary";

export interface IDiaryState {
    Records?: IDictionary<Array<IRecord>> | null
    Statistic?: IStatistic
}

export interface IStatistic {
    Glucose: ILevelGlucose
    Product: IAverageIndicator
}

export interface ILevelGlucose {
    Avg: number
    Min: number
    Max: number
}

export interface IAverageIndicator{
    Gi: number
    Xe: number
    Fats: number
    Proteins: number
    Carbohydrates: number
}

export enum TypeRecord {
    Glucose,
    Product
}

export interface IRecord {
    Name: string
    Date: string
    Type: TypeRecord
    ObjectRecord: IOutFoodRecord | IGlucoseMeasurement
}

export interface IOutFoodRecord extends IFood, IProduct {}