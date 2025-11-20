import {Inject, Service} from "typedi";
import {server} from "../../Server";
import V1GazEmissionDto from "../dto/V1GazEmissionDto";
import V1GazEmissionDao from "../dao/V1GazEmissionDao";
import V1GazEmission from "../entities/V1GazEmission";

@Service()
export default class V1GazEmissionService {
	@Inject(()=>V1GazEmissionDao)
	v1GazEmissionDao!: V1GazEmissionDao

	save = async (dto:V1GazEmissionDto) => {
		return await server.sequelize.transaction(async t => {
			try {
				let v1GazEmission: V1GazEmission | null;
				//
				if (dto.id){
					v1GazEmission = await this.v1GazEmissionDao.findById(BigInt(dto.id))
					if(!v1GazEmission){
						throw new Error('V1 not found')
					}
					await v1GazEmission.update({
						weightPrimaryMaterialCarbonneEmission: dto.weightPrimaryMaterialCarbonneEmission,
						primaryMaterialCarbonneEmission: dto.primaryMaterialCarbonneEmission,
						weightFirstMaterialCarbonneEmission: dto.weightFirstMaterialCarbonneEmission,
						firstMaterialCarbonneEmission: dto.firstMaterialCarbonneEmission,
						weightSecondMaterialCarbonneEmission: dto.weightSecondMaterialCarbonneEmission,
						secondMaterialCarbonneEmission: dto.secondMaterialCarbonneEmission,
						resultElement1: this.calculateElement1(dto),
						totalElectrictyMix: dto.totalElectrictyMix,
						greenConsomation: dto.greenConsomation,
						greenConsomatio: dto.greenProductionSite,
						productionSiteFrench: dto.productionSiteFrench,
						transportCoef1: dto.transportCoef1,
						transportCoef2: dto.transportCoef2,
						distanceMode1: dto.distanceMode1,
						distanceMode2: dto.distanceMode2,
						fabricationMultisite: dto.fabricationMultisite,
						criteria1: this.pointFromEl1Crit1(this.calculateElement1(dto)) + this.pointFromEl2Crit1(dto.containsRareMaterial),
						criteria2: this.pointFromEl1Crit2(dto.totalElectrictyMix) + this.pointFromEl2Crit2(dto.greenConsomation, dto.greenProductionSite),
						criteria3: this.pointFromEl1Crit3(dto) + this.pointFromEl2Crit3(dto.fabricationMultisite),
					})
				}else{	

					//Fill the instance 
					v1GazEmission = V1GazEmission.build({
						weightPrimaryMaterialCarbonneEmission: dto.weightPrimaryMaterialCarbonneEmission,
						primaryMaterialCarbonneEmission : dto.primaryMaterialCarbonneEmission,
						weightFirstMaterialCarbonneEmission: dto.weightFirstMaterialCarbonneEmission,
						firstMaterialCarbonneEmission: dto.firstMaterialCarbonneEmission,
						weightSecondMaterialCarbonneEmission: dto.weightSecondMaterialCarbonneEmission,
						secondMaterialCarbonneEmission: dto.secondMaterialCarbonneEmission,
						resultElement1: this.calculateElement1(dto),
						totalElectrictyMix: dto.totalElectrictyMix,
						greenConsomation: dto.greenConsomation,
						greenConsomatio: dto.greenProductionSite,
						transportCoef1: dto.transportCoef1,
						transportCoef2: dto.transportCoef2,
						distanceMode1: dto.distanceMode1,
						distanceMode2: dto.distanceMode2,
						fabricationMultisite: dto.fabricationMultisite,
						criteria1: this.pointFromEl1Crit1(this.calculateElement1(dto)) + this.pointFromEl2Crit1(dto.containsRareMaterial),
						criteria2: this.pointFromEl1Crit2(dto.totalElectrictyMix) + this.pointFromEl2Crit2(dto.greenConsomation, dto.greenProductionSite),
						criteria3: this.pointFromEl1Crit3(dto) + this.pointFromEl2Crit3(dto.fabricationMultisite),
					})
				}

				//Save the transactions
				await v1GazEmission.save({transaction: t})

				return v1GazEmission;
			}catch (err) {
				console.log(err)
			}	

		})
	}

	calculateElement1 = (dto:V1GazEmissionDto) => {
		
		const mp = dto.weightPrimaryMaterialCarbonneEmission;
		const m1 = dto.weightFirstMaterialCarbonneEmission;
		const m2 = dto.weightSecondMaterialCarbonneEmission;

		const ecp = dto.primaryMaterialCarbonneEmission;
		const ec1 = dto.firstMaterialCarbonneEmission;
		const ec2 = dto.secondMaterialCarbonneEmission;
		return  (mp*ecp + m1*ec1+ m2*ec2) / (mp + m1 + m2)
		
	}
	//Refer to tab-1 page 26
	pointFromEl1Crit1 = (value:number | undefined): number => {
		if(!value ){return 0;}
		else if (value < 0.5){return 10}
		else if (value >= 0.5 && value < 1){return 8}
		else if (value >= 1 && value < 5){return 6}
		else if (value >= 5 && value < 10){return 4}
		else if (value >= 10 && value < 25){return 2}
		else if (value >= 25 && value <50){return 1}
		else if (value >= 50){return 0}
		else{return 0}

	}
	//Refers to tab-2 page 27
	pointFromEl2Crit1= (value:boolean | undefined) => {
		return (value==true) ? 0 : 5;
	}

	pointFromEl1Crit2= (value:number) => {
				
		if(!value ){return 0;}
		else if (value < 20){return 5}
		else if (value < 20 && value < 40){return 4}
		else if (value >= 40 && value < 200){return 3}
		else if (value >= 200 && value < 400){return 2}
		else if (value >= 400 && value < 600){return 1}
		else if (value >= 600){return 0}
		else{return 0}
	}

	//Refer to calcul de l'impact et attribution des points page 32
	pointFromEl2Crit2= (greenConsomation:boolean, greenProductionSite:boolean) => {
		return (greenConsomation && greenProductionSite ) ? 10 : (greenConsomation || greenProductionSite) ? 5 : 0
	}

	//Refet to tab-7 page 32
	pointFromEl1Crit3 = (dto:V1GazEmissionDto) => {
		const impactCarbonne  = ( dto.transportCoef1 * dto.distanceMode1) + (dto.transportCoef2 * dto.distanceMode2)

		if (impactCarbonne < 50){return 5}
		else if (impactCarbonne >= 50 && impactCarbonne < 100){return 4}
		else if (impactCarbonne >= 100 && impactCarbonne < 200){return 3}
		else if (impactCarbonne >= 200 && impactCarbonne < 300){return 2}
		else if (impactCarbonne >= 300 && impactCarbonne < 500){return 1}
		else if (impactCarbonne >= 500){return 0}
		else{return 0}

	}

	pointFromEl2Crit3 = (numberFabSite:number) => {
		return 	(numberFabSite == 1) ? 5 : (numberFabSite == 2) ? 2 : 0
	}
}
