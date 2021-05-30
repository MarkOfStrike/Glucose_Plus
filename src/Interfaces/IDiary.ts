import { IFood } from "../DataBase/Models/Food";
import { IGlucoseMeasurement } from "../DataBase/Models/GlucoseMeasurement";
import { IProduct } from "../DataBase/Models/Product";
import { IDictionary } from "./IDictionary";

export interface IDiaryState {
    Records?: IDictionary<Array<IDiaryRecord<IRecordFoodDiary|IRecordGlucoseDiary>>> | null
    Statistic?: IStatistic
}

export interface IStatistic {
    Glucose: ILevelGlucose
    Product: IDataIndicator
}

export interface ILevelGlucose {
    Avg: number
    Min: number
    Max: number
}

export interface IDataIndicator{
    Gi: number
    Xe: number
    Fats: number
    Proteins: number
    Carbohydrates: number
    Calories: number
}

export enum TypeRecord {
    Glucose,
    Product
}

export interface IDiaryRecord<T> {
    Date: string
    Type: TypeRecord
    ObjectRecord: T
}

export interface IRecordGlucoseDiary {
    Id:number
    Level: number
}

export interface IRecordFoodDiary {
    Id: number
    Name: string
    data: IDataProduct
}

export interface IDataProduct extends IDataIndicator {
    weight: number
}

export interface IRecord {
    Name: string
    Date: string
    Type: TypeRecord
    ObjectRecord: IOutFoodRecord | IGlucoseMeasurement
}

export interface IOutFoodRecord extends IFood, IProduct {}