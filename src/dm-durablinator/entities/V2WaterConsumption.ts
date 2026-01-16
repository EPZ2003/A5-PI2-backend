import { BelongsTo, Column, ForeignKey, Table } from "sequelize-typescript";
import AbstracEntity from "../../utils/AbstractEntity";
import { Constant } from "../../constant/Constant";
import { DataTypes } from "sequelize";
import IndexDMDurable from "./IndexDMDurable";

@Table({
	timestamps: true,
	tableName: Constant.PREFIX_TABLE + 'v2_water_consumption',
	freezeTableName: true
})
export default class V2WaterConsumption extends AbstracEntity {
	@ForeignKey(() => IndexDMDurable)
	@Column
	indexDMDurableId!: bigint;

	@BelongsTo(() => IndexDMDurable)
	indexDMDurable!: IndexDMDurable;

	@Column({
		type: DataTypes.BOOLEAN,
		allowNull: false,
		defaultValue: false
	})
	noWaterNeed!: boolean;

	@Column(DataTypes.INTEGER)
	waterMadeQuantity!: number;

	@Column(DataTypes.INTEGER)
	waterConsommationQuantity!: number;

	@Column(DataTypes.FLOAT)
	totalReusedWater?: number;

	@Column(DataTypes.FLOAT)
	totalConsumedWater?: number;

	@Column(DataTypes.FLOAT)
	reusabilityWaterPoints?: number;

	@Column(DataTypes.FLOAT)
	vulnerability?: number;
}
