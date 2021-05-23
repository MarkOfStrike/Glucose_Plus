import { IDictionary } from "../Interfaces/IDictionary";

export class Dictionary<value> {
    private dic: IDictionary<value>;

    constructor() {
        this.dic = {};
    }

    add(key:string, value: value){

        if(this.containsKey(key)){
            this.dic[key] = {...this.dic[key], value}
        }
        else {
            this.dic = {
                ...this.dic, 
                key:value
            }
        }

        
    }

    remove(key:string){
        delete this.dic[key];
    }

    getValue(key:string) {return this.dic[key];}

    setValue(key:string, value:value){
        this.dic[key] = value;
    }

    containsKey(key:string) {
        return this.dic[key] != undefined
    }

    getObject(){
        return this.dic;
    }
}