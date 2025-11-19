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
	
	totalElectrictyMix!:number;

	greenConsomation!:boolean;

	greenProductionSite!:boolean;

	productionSiteFrench!: boolean

	transportCoef1!:number

	transportCoef2!: number

	distanceMode1!: number

	distanceMode2!: number

	fabricationMultisite!: number 

	criteria1?: number;

	criteria2?: number;
	
	criteria3?: number;

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
		this.totalElectrictyMix = v1GazEmission.totalElectrictyMix;
		this.greenConsomation = v1GazEmission.greenConsomation ?? false;
		this.greenProductionSite = v1GazEmission.greenProductionSite ?? false;
		this.productionSiteFrench= v1GazEmission.productionSiteFrench ?? false;
		this.transportCoef1= v1GazEmission.transportCoef1;
		this.transportCoef2=v1GazEmission.transportCoef2;
		this.distanceMode1=v1GazEmission.distanceMode1;
		this.distanceMode2=v1GazEmission.distanceMode2;
		this.fabricationMultisite=v1GazEmission.fabricationMultisite;

		this.criteria1 = v1GazEmission.criteria1 ?? 0;
		this.criteria2 = v1GazEmission.criteria2 ?? 0;
		this.criteria3 = v1GazEmission.criteria3 ?? 0;
	}
}
