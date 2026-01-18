import { BelongsTo, Column, ForeignKey, Table } from "sequelize-typescript";
import AbstractEntity from "../../utils/AbstractEntity";
import { Constant } from "../../constant/Constant";
import { DataTypes } from "sequelize";
import IndexDMDurable from "./IndexDMDurable";

@Table({
	timestamps: true,
	tableName: Constant.PREFIX_TABLE + 'v6_inclusion_and_diversity',
	freezeTableName: true
})
export default class V6InclusionAndDiversity extends AbstractEntity {
	@ForeignKey(() => IndexDMDurable)
	@Column
	indexDMDurableId!: bigint;

	@BelongsTo(() => IndexDMDurable)
	indexDMDurable!: IndexDMDurable;

	// Demographic composition data
	@Column(DataTypes.FLOAT)
	youngEmploymentPercentage!: number; // Percentage of employees < 30 years (0-100)

	@Column(DataTypes.FLOAT)
	seniorEmploymentPercentage!: number; // Percentage of employees > 50 years (0-100)

	@Column(DataTypes.FLOAT)
	womenManagementPercentage!: number; // Percentage of women in senior management (0-100)

	// Wage equality data
	@Column(DataTypes.FLOAT)
	menAverageHourlyWage!: number; // Average gross hourly wage for men (>= 0)

	@Column(DataTypes.FLOAT)
	womenAverageHourlyWage!: number; // Average gross hourly wage for women (>= 0)

	// Disability and inclusion data
	@Column(DataTypes.INTEGER)
	disabledEmployeesCount!: number; // Number of employees with disabilities (>= 0)

	@Column(DataTypes.INTEGER)
	totalEmployeesCount!: number; // Total number of employees (>= 0)

	// Anti-discrimination data
	@Column(DataTypes.BOOLEAN)
	discriminationOrganizationInPlace!: boolean; // Whether discrimination prevention organization is in place

	@Column(DataTypes.BOOLEAN)
	followUpAlerts?: boolean | null; // Whether follow-up of alerts is in place (optional if organization is false)

	// Calculated points
	@Column(DataTypes.FLOAT)
	youngEmploymentPoints?: number;

	@Column(DataTypes.FLOAT)
	seniorEmploymentPoints?: number;

	@Column(DataTypes.FLOAT)
	womenManagementPoints?: number;

	@Column(DataTypes.FLOAT)
	salarialEquityPoints?: number;

	@Column(DataTypes.FLOAT)
	accessibilityInclusionPoints?: number;

	@Column(DataTypes.FLOAT)
	antidiscriminationPoints?: number;

	@Column(DataTypes.FLOAT)
	vulnerability?: number; // Final vulnerability score (0-20)
}
