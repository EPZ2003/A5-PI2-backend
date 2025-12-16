import V4HealthSecurityWorkCondition from "../entities/V4HealthSecurityWorkCondition";

export default class V4HealthSecurityWorkConditionDto{
	id!:bigint;

	averageHealthInvest!: number;

	totalHealhInvest!: number;

	criteria1!: number;

	budgetWorkHealthSecurity!:number;

	totalWorkerNumber!:number;


	constructor(v4HealthSecurityWorkCondition: V4HealthSecurityWorkCondition){
		this.id = v4HealthSecurityWorkCondition.id;
		this.averageHealthInvest = v4HealthSecurityWorkCondition.averageHealthInvest;
		this.totalHealhInvest = v4HealthSecurityWorkCondition.totalHealhInvest;
		this.criteria1 = v4HealthSecurityWorkCondition.criteria1
		this.budgetWorkHealthSecurity = v4HealthSecurityWorkCondition.budgetWorkHealthSecurity
		this.totalWorkerNumber = v4HealthSecurityWorkCondition.totalWorkerNumber
	}
}
