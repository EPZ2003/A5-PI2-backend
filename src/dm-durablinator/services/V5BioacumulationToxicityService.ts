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
                        labelWeitherClear: dto.labelWeitherClear,
                        labelPresencePicto: dto.labelPresencePicto,
                        labelTauxInferior: dto.labelTauxInferior,
                        informationReadablity: dto.informationReadablity,
                        informationWithFds: dto.informationWithFds,
                        informationPresence: dto.informationPresence,
                        criteria1: this.calculateCriteria1(dto.makingProcessRisk, dto.makingProcessProtectionMeasure, dto.finalProductRiskMatter, dto.finalProductConcentration, dto.finalProductContactAbsence),
                        criteria2: this.calculateCriteria2(dto.finalProductRiskMatter, dto.labelWeitherClear, dto.labelPresencePicto, dto.labelTauxInferior, dto.informationReadablity, dto.informationWithFds, dto.informationPresence)
                    })
                } else {
                    // Fill the instance
                    v5BioacumulationToxicity = V5BioacumulationToxicity.build({
                        makingProcessRisk: dto.makingProcessRisk,
                        makingProcessProtectionMeasure: dto.makingProcessProtectionMeasure,
                        finalProductRiskMatter: dto.finalProductRiskMatter,
                        finalProductConcentration: dto.finalProductConcentration,
                        finalProductContactAbsence: dto.finalProductContactAbsence,
                        labelWeitherClear: dto.labelWeitherClear,
                        labelPresencePicto: dto.labelPresencePicto,
                        labelTauxInferior: dto.labelTauxInferior,
                        informationReadablity: dto.informationReadablity,
                        informationWithFds: dto.informationWithFds,
                        informationPresence: dto.informationPresence,
                        criteria1: this.calculateCriteria1(dto.makingProcessRisk, dto.makingProcessProtectionMeasure, dto.finalProductRiskMatter, dto.finalProductConcentration, dto.finalProductContactAbsence),
                        criteria2: this.calculateCriteria2(dto.finalProductRiskMatter, dto.labelWeitherClear, dto.labelPresencePicto, dto.labelTauxInferior, dto.informationReadablity, dto.informationWithFds, dto.informationPresence)
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

        try {
            if (id) {

                const entity = await this.v5BioacumulationToxicityDao.findById(id)
                if (entity) {

                    const v5BioacumulationToxicity = entity.dataValues
                    return this.calculateVulnerability(v5BioacumulationToxicity.criteria1, v5BioacumulationToxicity.criteria2)
                } else {
                    throw new Error('No V5 entity found')
                }
            } else {
                throw new Error('No provided id')
            }
        } catch (err) {
            console.log(err)
        }
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
    pointFromEl1Crit2 = (finalProductRiskMatter: boolean, labelWeitherClear: boolean, labelPresencePicto: boolean, labelTauxInferior: boolean): number => {
        // Refers to fig 3 page 59
        if (!finalProductRiskMatter) {
            return 5
        } else {
            if (labelWeitherClear) {
                if (labelPresencePicto) {
                    return 4
                } else {
                    return 3
                }
            } else {
                if (labelTauxInferior) {
                    return 2
                } else {
                    return 0
                }
            }
        }
    }

    pointFromEl2Crit2 = (finalProductRiskMatter: boolean, informationReadablity: boolean, informationWithFds: boolean, informationPresence: boolean): number => {
        // Refer to fig 4 page 60
        if (!finalProductRiskMatter) {
            return 5
        } else {
            if (informationReadablity) {
                if (informationWithFds) {
                    if (informationPresence) {
                        return 4
                    } else {
                        return 2
                    }
                } else {
                    return 4
                }
            } else {
                return 0
            }
        }
    }


    calculateCriteria1 = (makingProcessRisk: boolean, makingProcessProtectionMeasure: boolean, finalProductRiskMatter: boolean, finalProductConcentration: boolean, finalProductContactAbsence: boolean): number => {
        // Refer to calcul page 57
        return this.pointFromEl1Crit1(makingProcessRisk, makingProcessProtectionMeasure) + this.pointFromEl2Crit1(finalProductRiskMatter, finalProductConcentration, finalProductContactAbsence)
    }

    calculateCriteria2 = (finalProductRiskMatter: boolean, labelWeitherClear: boolean, labelPresencePicto: boolean, labelTauxInferior: boolean, informationReadablity: boolean, informationWithFds: boolean, informationPresence: boolean): number => {
        // Empty body as requested
        return this.pointFromEl1Crit2(finalProductRiskMatter, labelWeitherClear, labelPresencePicto, labelTauxInferior) + this.pointFromEl2Crit2(finalProductRiskMatter, informationReadablity, informationWithFds, informationPresence)
    }
    calculateVulnerability = (criteria1: number, criteria2: number): number => {
        return criteria1 + criteria2
    }

}
