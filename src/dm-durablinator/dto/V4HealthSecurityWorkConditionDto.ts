import V4HealthSecurityWorkCondition from "../entities/V4HealthSecurityWorkCondition";

export default class V4HealthSecurityWorkConditionDto{
	id!:bigint;

	averageHealthInvest!: number;

	totalHealhInvest!: number;

	budgetWorkHealthSecurity!:number;

	totalWorkerNumber!:number;

	scoreSPI!:number;
	
	criteria1?: number;
	
	criteria2?: number;


	constructor(v4HealthSecurityWorkCondition: V4HealthSecurityWorkCondition){
		this.id = v4HealthSecurityWorkCondition.id;
		this.averageHealthInvest = v4HealthSecurityWorkCondition.averageHealthInvest;
		this.totalHealhInvest = v4HealthSecurityWorkCondition.totalHealhInvest;
		this.budgetWorkHealthSecurity = v4HealthSecurityWorkCondition.budgetWorkHealthSecurity
		this.totalWorkerNumber = v4HealthSecurityWorkCondition.totalWorkerNumber
		this.scoreSPI = v4HealthSecurityWorkCondition.scoreSPI

		//Criterias that will be used to calculate the vulnerability 
		this.criteria1 = v4HealthSecurityWorkCondition.criteria1 ?? 0;
		this.criteria2 = v4HealthSecurityWorkCondition.criteria2 ?? 0;
	}
}
