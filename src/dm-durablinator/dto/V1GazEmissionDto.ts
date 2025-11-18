import V1GazEmission from "../entities/V1GazEmission";

export default class V1GazEmissionDto {
	id!:bigint;
	weightPrimaryMaterialCarbonneEmission!: number;

	primaryMaterialCarbonneEmission!: number;
	
	weightFirstMaterialCarbonneEmission!: number;

	firstMaterialCarbonneEmission!: number;

	weightSecondMaterialCarbonneEmission!: number;

	secondMaterialCarbonneEmission!: number;

	resultElement1?: number;

	containsRareMaterial!:boolean;

	criteria1?: number;

	constructor(v1GazEmission: V1GazEmission){
		this.id=v1GazEmission.id
		this.weightPrimaryMaterialCarbonneEmission = v1GazEmission.weightPrimaryMaterialCarbonneEmission;
		this.primaryMaterialCarbonneEmission = v1GazEmission.primaryMaterialCarbonneEmission;
		this.weightFirstMaterialCarbonneEmission = v1GazEmission.firstMaterialCarbonneEmission;
		this.firstMaterialCarbonneEmission = v1GazEmission.firstMaterialCarbonneEmission;
		this.weightSecondMaterialCarbonneEmission = v1GazEmission.weightSecondMaterialCarbonneEmission
		this.secondMaterialCarbonneEmission = v1GazEmission.secondMaterialCarbonneEmission;
		this.resultElement1 = v1GazEmission.resultElement1 ?? 0
		this.containsRareMaterial = v1GazEmission.containsRareMaterial
		this.criteria1 = v1GazEmission.criteria1 ?? 0
	}
}
