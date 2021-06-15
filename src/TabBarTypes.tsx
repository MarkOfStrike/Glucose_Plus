import { TypeRecord } from "./Interfaces/IDiary"

export type RootNavigationParamList = {
    Home: undefined;
    Statistic: undefined;
    Setting: undefined;
}

export type HomeNavigationParamsList = {
    Diary: undefined;
    AddRecord: undefined;
    MoreDetailsOfRecord: {
        id: number,
        type: TypeRecord
    }
}