import { Inject, Service } from "typedi";
import V4HealthSecurityWorkConditionDao from "../dao/V4HealthSecurityWorkConditionDao";
import V4HealthSecurityWorkConditionDto from "../dto/V4HealthSecurityWorkConditionDto";
import { server } from "../../Server";
import V4HealthSecurityWorkCondition from "../entities/V4HealthSecurityWorkCondition";
import IndexDMDurable from "../entities/IndexDMDurable";
import IndexDMDurableDao from "../dao/IndexDMDurableDao";

@Service()
export default class V4HealthSecurityWorkConditionService {
	@Inject(() => V4HealthSecurityWorkConditionDao)
	V4HealthSecurityWorkConditionDao: V4HealthSecurityWorkConditionDao;

	@Inject(() => IndexDMDurableDao)
	indexDMDurableDao!: IndexDMDurableDao

	save = async (dto: V4HealthSecurityWorkConditionDto, idIndexDmDurable: bigint | undefined) => {
		return await server.sequelize.transaction(async t => {
			try {
				if (!idIndexDmDurable) {
					throw new Error('No indexDmDurable provided')
				}
				const indexDmDurable: IndexDMDurable | null = await this.indexDMDurableDao.findById(idIndexDmDurable)
				if (!indexDmDurable) {
					throw new Error('IndexDmDurable not found')
				}
				let v4HealthSecurityWorkCondition: V4HealthSecurityWorkCondition | null;
				//If we want to update the data 
				if (dto.id) {
					v4HealthSecurityWorkCondition = await this.V4HealthSecurityWorkConditionDao.findById(BigInt(dto.id))
					if (!v4HealthSecurityWorkCondition) {
						throw new Error('V4 not found')
					}
					await v4HealthSecurityWorkCondition.update({
						indexDMDurableId: indexDmDurable.id,
						averageHealthInvest: dto.averageHealthInvest,
						totalHealhInvest: dto.totalHealhInvest,
						budgetWorkHealthSecurity: dto.budgetWorkHealthSecurity,
						totalWorkerNumber: dto.totalWorkerNumber,
						scoreSPI: dto.scoreSPI,
						healthSecurityPrevention: dto.healthSecurityPrevention,
						workDeath: dto.workDeath,
						workAccidentNumber: dto.workAccidentNumber,
						totalWorkHour: dto.totalWorkHour,
						criteria1: this.pointFromEl1Crit1(dto.averageHealthInvest, dto.totalHealhInvest) + this.pointFromEl2Crit1(dto.budgetWorkHealthSecurity, dto.totalWorkerNumber),
						criteria2: this.pointFromCrit2(dto.scoreSPI),
						criteria3: this.pointFromCrit3(dto.healthSecurityPrevention),
						criteria4: this.pointFromEl1Crit4(dto.workDeath) + this.pointFromEl2Crit4(dto.workAccidentNumber, dto.totalWorkHour)
					})
				} else {
					//Create a new instance
					v4HealthSecurityWorkCondition = V4HealthSecurityWorkCondition.build({
						indexDMDurableId: indexDmDurable.id,
						averageHealthInvest: dto.averageHealthInvest,
						totalHealhInvest: dto.totalHealhInvest,
						budgetWorkHealthSecurity: dto.budgetWorkHealthSecurity,
						totalWorkerNumber: dto.totalWorkerNumber,
						scoreSPI: dto.scoreSPI,
						healthSecurityPrevention: dto.healthSecurityPrevention,
						workDeath: dto.workDeath,
						workAccidentNumber: dto.workAccidentNumber,
						totalWorkHour: dto.totalWorkHour,
						criteria1: this.pointFromEl1Crit1(dto.averageHealthInvest, dto.totalHealhInvest) + this.pointFromEl2Crit1(dto.budgetWorkHealthSecurity, dto.totalWorkerNumber),
						criteria2: this.pointFromCrit2(dto.scoreSPI),
						criteria3: this.pointFromCrit3(dto.healthSecurityPrevention),
						criteria4: this.pointFromEl1Crit4(dto.workDeath) + this.pointFromEl2Crit4(dto.workAccidentNumber, dto.totalWorkHour)
					})
				}
				//save the instance
				await v4HealthSecurityWorkCondition.save({ transaction: t })
				return v4HealthSecurityWorkCondition
			} catch (err) {
				console.log(err)
			}
		})
	}

	getVulnerability = async (id: bigint | undefined) => {
		try {
			if (id) {
				const entity = await this.V4HealthSecurityWorkConditionDao.findById(id)
				if (entity) {
					const v4HealthSecurityWorkCondition = entity.dataValues
					return this.calculateVulnerability(v4HealthSecurityWorkCondition.criteria1, v4HealthSecurityWorkCondition.criteria2, v4HealthSecurityWorkCondition.criteria3, v4HealthSecurityWorkCondition.criteria4)
				} else {
					throw new Error('No V4 entity found')
				}
			} else {
				throw new Error('No provided id')
			}
		} catch (err) {
			console.log(err)
		}
	}

	//Refer to  calcul page 45 AND tab-15 page 46
	pointFromEl1Crit1 = (averageHealthInvest: number | undefined, totalHealhInvest: number | undefined): number => {
		if (!averageHealthInvest || !totalHealhInvest || totalHealhInvest == 0) { return 0; }
		//Calcul page 45
		//It is in pourcentage because averageHealthInvest is a part totalHealhInvest 
		const value = (averageHealthInvest / totalHealhInvest);

		if (value < 0.01) { return 0; }
		else if (value >= 0.01 && value < 0.1) { return 2; }
		else if (value >= 0.1) { return 3; }
		else { return 0; }
	}

	//Refer to Calcul AND tab-16 page 47
	pointFromEl2Crit1 = (budgetWorkHealthSecurity: number | undefined, totalWorkerNumber: number | undefined): number => {
		if (!budgetWorkHealthSecurity || !totalWorkerNumber || totalWorkerNumber == 0) { return 0; }
		//Refer to calcul page 47 
		const value = budgetWorkHealthSecurity / totalWorkerNumber;

		if (value < 50) { return 0; }
		else if (value >= 50 && value < 100) { return 2; }
		else if (value >= 100) { return 4; }
		else { return 0; }
	}
	//Refer to tab-17 page 49
	pointFromCrit2 = (scoreSPI: number | undefined): number => {
		if (!scoreSPI) { return 0; }
		const value = scoreSPI;
		if (value < 70) { return 0; }
		else if (value >= 70 && value < 80) { return 3; }
		else if (value >= 80) { return 5; }
		else { return 0; }
	}
	//Refer to tab-18 page 50
	pointFromCrit3 = (healthSecurityPrevention: number | undefined): number => {
		if (!healthSecurityPrevention) { return 0; }
		const value = healthSecurityPrevention;
		if (value < 50) { return 0; }
		else if (value >= 50 && value < 80) { return 1; }
		else if (value >= 80) { return 3; }
		else { return 0; }
	}
	//Refer to tab-19 page 52
	pointFromEl1Crit4 = (workDeath: boolean): number => {
		return workDeath ? 1 : 0;
	}

	//Refer to tab-20 page 52 
	pointFromEl2Crit4 = (workAccidentNumber: number | undefined, totalWorkHour: number | undefined) => {
		if (!workAccidentNumber || !totalWorkHour || totalWorkHour == 0) { return 0; }
		const value = (workAccidentNumber / totalWorkHour) * 1000000;
		if (value >= 10) { return 0; }
		else if (value < 10 && value >= 4) { return 2; }
		else if (value < 4) { return 4; }
		else { return 0; }
	}

	//Refer to calcul 9.4 page 52
	calculateVulnerability = (pointCrit1: number | undefined, pointCrit2: number | undefined, pointCrit3: number | undefined, pointCrit4: number | undefined) => {
		if (pointCrit1 == undefined || pointCrit2 == undefined || pointCrit3 == undefined || pointCrit4 == undefined) { return; }
		return pointCrit1 + pointCrit2 + pointCrit3 + pointCrit4;
	}

}
