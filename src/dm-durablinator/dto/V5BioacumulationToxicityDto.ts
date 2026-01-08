import V5BioacumulationToxicity from "../entities/V5BioacumulationToxicity";

export default class V5BioacumulationToxicityDto {
	id!: bigint;

	makingProcessRisk!: boolean

	makingProcessProtectionMeasure!: boolean

	finalProductRiskMatter!: boolean

	finalProductConcentration!: boolean

	finalProductContactAbsence!: boolean

	labelWeitherClear!: boolean

	labelPresencePicto!: boolean

	labelTauxInferior!: boolean

	criteria1?: number
	criteria2?: number

	informationReadablity!: boolean

	informationWithFds!: boolean

	informationPresence!: boolean

	constructor(v5BioacumulationToxicity: V5BioacumulationToxicity) {
		this.id = v5BioacumulationToxicity.id;
		this.makingProcessRisk = v5BioacumulationToxicity.makingProcessRisk;
		this.makingProcessProtectionMeasure = v5BioacumulationToxicity.makingProcessProtectionMeasure;
		this.finalProductRiskMatter = v5BioacumulationToxicity.finalProductRiskMatter;
		this.finalProductConcentration = v5BioacumulationToxicity.finalProductConcentration;
		this.finalProductContactAbsence = v5BioacumulationToxicity.finalProductContactAbsence;
		this.labelWeitherClear = v5BioacumulationToxicity.labelWeitherClear;
		this.labelPresencePicto = v5BioacumulationToxicity.labelPresencePicto;
		this.labelTauxInferior = v5BioacumulationToxicity.labelTauxInferior;
		this.criteria1 = v5BioacumulationToxicity.criteria1 ?? 0;
		this.criteria2 = v5BioacumulationToxicity.criteria2 ?? 0;
		this.informationReadablity = v5BioacumulationToxicity.informationReadablity;
		this.informationWithFds = v5BioacumulationToxicity.informationWithFds;
		this.informationPresence = v5BioacumulationToxicity.informationPresence;
	}
}
