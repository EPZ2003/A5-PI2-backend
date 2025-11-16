import {DateTime} from "luxon"
import { AutoIncrement, BeforeBulkCreate, BeforeCreate, BeforeUpdate, Column, DataType, Model, PrimaryKey } from "sequelize-typescript";


export default class AbstracEntity extends Model{
    
    @AutoIncrement
    @PrimaryKey    
    @Column
    declare id:bigint;

    @Column(DataType.BIGINT)
    creationDate!: number

    @Column(DataType.BIGINT)
    updateDate!: number

    @BeforeCreate
    static setCreationDate(instance: AbstracEntity){
        instance.creationDate = DateTime.now().valueOf();
    }

    @BeforeBulkCreate
    static setCreationDates(instances: AbstracEntity[]){
        for (let instance of instances){
            instance.creationDate = DateTime.now().valueOf();
        }
    }

    @BeforeUpdate
    static setUpdateDate(instance: AbstracEntity){
        instance.updateDate = DateTime.now().valueOf()
    }
   
}
