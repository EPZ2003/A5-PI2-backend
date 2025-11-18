import {Column, Table} from "sequelize-typescript";
import AbstracEntity from "../../utils/AbstractEntity";
import {Constant} from "../../constant/Constant";
import {DataTypes} from "sequelize";

@Table({
	timestamps:false,
	tableName: Constant.PREFIX_TABLE + 'v1_gaz_emission',
	freezeTableName: true
})
export default class V1GazEmission extends AbstracEntity {
	@Column
	weightPrimaryMaterialCarbonneEmission!:number;

	@Column
	primaryMaterialCarbonneEmission!:number;

	@Column
	weightFirstMaterialCarbonneEmission!: number;

	@Column
	firstMaterialCarbonneEmission!: number;

	@Column
	weightSecondMaterialCarbonneEmission!: number;

	@Column
	secondMaterialCarbonneEmission!: number;
	
	@Column(DataTypes.FLOAT)
	resultElement1?:number
	
	@Column(DataTypes.BOOLEAN)
	containsRareMaterial!: boolean
	
	@Column
	totalElectrictyMix!: number

	@Column(DataTypes.BOOLEAN)
	greenConsomation!:boolean

	@Column(DataTypes.BOOLEAN)
	greenProductionSite!:boolean

	@Column
	criteria1?:number

	@Column
	criteria2?:number
}
