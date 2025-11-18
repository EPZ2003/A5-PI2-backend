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
						criteria1: this.pointFromElement1(dto.resultElement1)
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
						criteria1: this.pointFromElement1(dto.resultElement1) //+ ELEMENT 2 TO DO IT
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
	pointFromElement1 = (value:number | undefined): number => {
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
}
