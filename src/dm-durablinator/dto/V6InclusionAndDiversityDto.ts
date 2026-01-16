export default class V6InclusionAndDiversityDto {
	id?: bigint;
	youngEmploymentPercentage!: number;
	seniorEmploymentPercentage!: number;
	womenManagementPercentage!: number;
	menAverageHourlyWage!: number;
	womenAverageHourlyWage!: number;
	disabledEmployeesCount!: number;
	totalEmployeesCount!: number;
	discriminationOrganizationInPlace!: boolean;
	followUpAlerts?: boolean | null;
}
