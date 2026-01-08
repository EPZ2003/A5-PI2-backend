import { Column, Table } from "sequelize-typescript";
import { Constant } from "../../constant/Constant";
import AbstracEntity from "../../utils/AbstractEntity";
import { DataTypes } from "sequelize";

@Table({
	timestamps: false,
	tableName: Constant.PREFIX_TABLE + 'v5_bioacumulation_toxicity',
	freezeTableName: true
})
export default class V5BioacumulationToxicity extends AbstracEntity {

	// Logic schema page 55 Figure 1
	@Column(DataTypes.BOOLEAN)
	makingProcessRisk!: boolean

	@Column(DataTypes.BOOLEAN)
	makingProcessProtectionMeasure: boolean

	// Logic schema  page 57 Figure 2 
	@Column(DataTypes.BOOLEAN)
	finalProductRiskMatter: boolean

	@Column(DataTypes.BOOLEAN)
	finalProductConcentration: boolean

	@Column(DataTypes.BOOLEAN)
	finalProductContactAbsence: boolean

	@Column
	criteria1!: number

}
