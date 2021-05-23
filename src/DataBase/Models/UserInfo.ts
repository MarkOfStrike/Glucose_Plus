export interface IUserInfo {
    Id?: number
    Name?: string
    Surname?: string
    Weight?: number
    Height?: number
    Glucose?: {
        Min?: number
        Max?: number
    }
    DateOfBirth?: Date
    UserIdServer?:number

}