import { Inject, Service } from "typedi";
import { server } from "../../Server";
import FinalPageIndexDmDurableDto from "../dto/FinalPageIndexDmDurableDto";
import V1GazEmissionService from "./V1GazEmissionService";
import V2WaterConsumptionService from "./V2WaterConsumptionService";
import V3WasteProductionService from "./V3WasteProductionService";
import V4HealthSecurityWorkConditionService from "./V4HealthSecurityWorkConditionService";
import V5BioacumulationToxicityService from "./V5BioacumulationToxicityService";
import V6InclusionAndDiversityService from "./V6InclusionAndDiversityService";
import IndexDMDurable from "../entities/IndexDMDurable";
import IndexDMDurableDao from "../dao/IndexDMDurableDao";
import V1GazEmission from "../entities/V1GazEmission";
import V4HealthSecurityWorkCondition from "../entities/V4HealthSecurityWorkCondition";
import V5BioacumulationToxicity from "../entities/V5BioacumulationToxicity";
import V2WaterConsumption from "../entities/V2WaterConsumption";
import V3WasteProduction from "../entities/V3WasteProduction";
import V6InclusionAndDiversity from "../entities/V6InclusionAndDiversity";

@Service()
export default class IndexDMDurableService {

    @Inject(() => IndexDMDurableDao)
    indexDMDurableDao!: IndexDMDurableDao

    @Inject(() => V1GazEmissionService)
    v1GazEmissionService!: V1GazEmissionService

    @Inject(() => V2WaterConsumptionService)
    v2WaterConsumptionService!: V2WaterConsumptionService

    @Inject(() => V3WasteProductionService)
    v3WasteProductionService!: V3WasteProductionService

    @Inject(() => V4HealthSecurityWorkConditionService)
    v4HealthSecurityWorkConditionService!: V4HealthSecurityWorkConditionService

    @Inject(() => V5BioacumulationToxicityService)
    v5BioacumulationToxicityService!: V5BioacumulationToxicityService

    @Inject(() => V6InclusionAndDiversityService)
    v6InclusionAndDiversityService!: V6InclusionAndDiversityService

    getIndexDMDurable = async (idIndexDmDurable: bigint | undefined): Promise<FinalPageIndexDmDurableDto> => {

        if (!idIndexDmDurable) {
            throw new Error('No id provided')
        }
        const indexDMDurable = await this.indexDMDurableDao.findById(idIndexDmDurable, [
            V1GazEmission,
            V2WaterConsumption,
            V3WasteProduction,
            V4HealthSecurityWorkCondition,
            V5BioacumulationToxicity,
            V6InclusionAndDiversity
        ])
        if (!indexDMDurable) {
            throw new Error('No indexDMDurable found')
        }
        const v1GazEmission = await this.v1GazEmissionService.getVulnerability(indexDMDurable.v1GazEmission.id)
        const v2WaterConsumption = await this.v2WaterConsumptionService.getVulnerability(indexDMDurable.v2WaterConsumption.id)
        const v3WasteProduction = await this.v3WasteProductionService.getVulnerability(indexDMDurable.v3WasteProduction.id)
        const v4HealthSecurityWorkCondition = await this.v4HealthSecurityWorkConditionService.getVulnerability(indexDMDurable.v4HealthSecurityWorkCondition.id)
        const v5BioacumulationToxicity = await this.v5BioacumulationToxicityService.getVulnerability(indexDMDurable.v5BioacumulationToxicity.id)
        const v6InclusionAndDiversity = await this.v6InclusionAndDiversityService.getVulnerability(indexDMDurable.v6InclusionAndDiversity.id)
        return new FinalPageIndexDmDurableDto(v1GazEmission, v2WaterConsumption, v3WasteProduction, v4HealthSecurityWorkCondition, v5BioacumulationToxicity, v6InclusionAndDiversity);
    }

    newIndexDmDurable = async (nameOfMedicalName: string): Promise<number> => {
        //This will happened when you want to create a new simulation
        return await server.sequelize.transaction(async t => {
            const indexDMDurable = await IndexDMDurable.create({ nameOfMedicalName })
            await indexDMDurable.save({ transaction: t })
            return Number(indexDMDurable.id)
        })
    }

    getDataFromIndexDMDurable = async (idIndexDmDurable: bigint | undefined) => {
        try {
            if (!idIndexDmDurable) {
                throw new Error('No id provided')
            }
            const indexDMDurable = await this.indexDMDurableDao.findById(idIndexDmDurable, [
                V1GazEmission,
                V2WaterConsumption,
                V3WasteProduction,
                V4HealthSecurityWorkCondition,
                V5BioacumulationToxicity,
                V6InclusionAndDiversity
            ])
            if (!indexDMDurable) {
                throw new Error('No indexDMDurable found')
            }
            return indexDMDurable
        } catch (err) {
            throw new Error('Error while getting indexDMDurable')
        }
    }

    getAllIndexDMDurable = async () => {
        try {
            const indexDMDurables = await this.indexDMDurableDao.findAll([
                V1GazEmission,
                V2WaterConsumption,
                V3WasteProduction,
                V4HealthSecurityWorkCondition,
                V5BioacumulationToxicity,
                V6InclusionAndDiversity
            ])
            if (!indexDMDurables) {
                throw new Error('No indexDMDurable found')
            }
            return indexDMDurables
        } catch (err) {
            throw new Error('Error while getting indexDMDurable')
        }
    }

}