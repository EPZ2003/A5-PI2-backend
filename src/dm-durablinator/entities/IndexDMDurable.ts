import { Column, HasOne, Table } from "sequelize-typescript";
import { Constant } from "../../constant/Constant";
import AbstractEntity from "../../utils/AbstractEntity";
import V1GazEmission from "./V1GazEmission";
import V3WasteProduction from "./V3WasteProduction";
import V4HealthSecurityWorkCondition from "./V4HealthSecurityWorkCondition";
import V5BioacumulationToxicity from "./V5BioacumulationToxicity";

@Table({
    timestamps: false,
    tableName: Constant.PREFIX_TABLE + 'index_dmdurable',
    freezeTableName: true
})
export default class IndexDMDurable extends AbstractEntity {

    @Column
    nameOfMedicalName!: string;

    @HasOne(() => V1GazEmission)
    v1GazEmission!: V1GazEmission;

    @HasOne(() => V3WasteProduction)
    v3WasteProduction!: V3WasteProduction;

    @HasOne(() => V4HealthSecurityWorkCondition)
    v4HealthSecurityWorkCondition!: V4HealthSecurityWorkCondition;

    @HasOne(() => V5BioacumulationToxicity)
    v5BioacumulationToxicity!: V5BioacumulationToxicity;

}