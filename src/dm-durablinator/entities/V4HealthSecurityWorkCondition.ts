import {Column, Table} from "sequelize-typescript";
import {Constant} from "../../constant/Constant";
import AbstracEntity from "../../utils/AbstractEntity";
import {DataTypes} from "sequelize";
@Table({
	timestamps: false,
	tableName: Constant.PREFIX_TABLE + 'v4_healh_security_work_condition',
	freezeTableName: true
})
export default class V4HealthSecurityWorkCondition extends AbstracEntity{
	
	@Column
	averageHealthInvest!:number;

	@Column
	totalHealhInvest!: number;

	@Column
	budgetWorkHealthSecurity!: number;

	@Column
	totalWorkerNumber!: number;

	@Column(DataTypes.FLOAT)
	scoreSPI!:number;

	@Column(DataTypes.FLOAT)
	healthSecurityPrevention!:number

	@Column
	criteria1!: number;

	@Column 
	criteria2!:number;

	@Column
	criteria3!:number;

}
