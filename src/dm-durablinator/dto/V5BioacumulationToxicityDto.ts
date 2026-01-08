import V5BioacumulationToxicity from "../entities/V5BioacumulationToxicity";

export default class V5BioacumulationToxicityDto {
	id!: bigint;

	makingProcessRisk!: boolean

	makingProcessProtectionMeasure!: boolean

	finalProductRiskMatter!: boolean

	finalProductConcentration!: boolean

	finalProductContactAbsence!: boolean

	criteria1?: number

	constructor(v5BioacumulationToxicity: V5BioacumulationToxicity) {
		this.id = v5BioacumulationToxicity.id;
		this.makingProcessRisk = v5BioacumulationToxicity.makingProcessRisk;
		this.makingProcessProtectionMeasure = v5BioacumulationToxicity.makingProcessProtectionMeasure;
		this.finalProductRiskMatter = v5BioacumulationToxicity.finalProductRiskMatter;
		this.finalProductConcentration = v5BioacumulationToxicity.finalProductConcentration;
		this.finalProductContactAbsence = v5BioacumulationToxicity.finalProductContactAbsence;
		this.criteria1 = v5BioacumulationToxicity.criteria1 ?? 0;
	}
}
