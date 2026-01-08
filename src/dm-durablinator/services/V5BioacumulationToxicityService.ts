import { Inject, Service } from "typedi";
import { server } from "../../Server";
import V5BioacumulationToxicityDto from "../dto/V5BioacumulationToxicityDto";
import V5BioacumulationToxicityDao from "../dao/V5BioacumulationToxicityDao";
import V5BioacumulationToxicity from "../entities/V5BioacumulationToxicity";

@Service()
export default class V5BioacumulationToxicityService {

    @Inject(() => V5BioacumulationToxicityDao)
    v5BioacumulationToxicityDao!: V5BioacumulationToxicityDao

    save = async (dto: V5BioacumulationToxicityDto) => {
        return await server.sequelize.transaction(async t => {
            try {
                let v5BioacumulationToxicity: V5BioacumulationToxicity | null;

                if (dto.id) {
                    v5BioacumulationToxicity = await this.v5BioacumulationToxicityDao.findById(BigInt(dto.id))
                    if (!v5BioacumulationToxicity) {
                        throw new Error('V5 not found')
                    }
                    await v5BioacumulationToxicity.update({
                        makingProcessRisk: dto.makingProcessRisk,
                        makingProcessProtectionMeasure: dto.makingProcessProtectionMeasure,
                        finalProductRiskMatter: dto.finalProductRiskMatter,
                        finalProductConcentration: dto.finalProductConcentration,
                        finalProductContactAbsence: dto.finalProductContactAbsence,
                        criteria1: this.calculateCriteria1(dto.makingProcessRisk, dto.makingProcessProtectionMeasure, dto.finalProductRiskMatter, dto.finalProductConcentration, dto.finalProductContactAbsence)
                    })
                } else {
                    // Fill the instance
                    v5BioacumulationToxicity = V5BioacumulationToxicity.build({
                        makingProcessRisk: dto.makingProcessRisk,
                        makingProcessProtectionMeasure: dto.makingProcessProtectionMeasure,
                        finalProductRiskMatter: dto.finalProductRiskMatter,
                        finalProductConcentration: dto.finalProductConcentration,
                        finalProductContactAbsence: dto.finalProductContactAbsence,
                        criteria1: this.calculateCriteria1(dto.makingProcessRisk, dto.makingProcessProtectionMeasure, dto.finalProductRiskMatter, dto.finalProductConcentration, dto.finalProductContactAbsence)
                    })
                }

                // Save the transactions
                await v5BioacumulationToxicity.save({ transaction: t })

                return v5BioacumulationToxicity;
            } catch (err) {
                console.log(err)
            }
        })
    }

    getVulnerability = async (id: bigint | undefined) => {
        // Empty body as requested
    }

    pointFromEl1Crit1 = (makingProcessRisk: boolean, makingProcessProtectionMeasure: boolean): number => {
        //Refers to fig 1 page 55 
        if (!makingProcessRisk) {
            return 5
        } else {
            if (makingProcessProtectionMeasure) {
                return 3
            } else {
                return 0
            }
        }
    }
    pointFromEl2Crit1 = (finalProductRiskMatter: boolean, finalProductConcentration: boolean, finalProductContactAbsence: boolean): number => {
        //Refer to fig 2 page 57
        if (!finalProductRiskMatter) {
            return 5
        } else {
            if (finalProductConcentration) {
                if (finalProductContactAbsence) {
                    return 3
                } else {
                    return 2
                }
            } else {
                if (finalProductContactAbsence) {
                    return 2
                } else {
                    return 0
                }
            }
        }
    }

    calculateCriteria1 = (makingProcessRisk: boolean, makingProcessProtectionMeasure: boolean, finalProductRiskMatter: boolean, finalProductConcentration: boolean, finalProductContactAbsence: boolean) => {
        // Refer to calcul page 57
        return this.pointFromEl1Crit1(makingProcessRisk, makingProcessProtectionMeasure) + this.pointFromEl2Crit1(finalProductRiskMatter, finalProductConcentration, finalProductContactAbsence)
    }

    calculateCriteria2 = () => {
        // Empty body as requested
    }

}
