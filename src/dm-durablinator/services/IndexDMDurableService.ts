import { Inject, Service } from "typedi";
import { server } from "../../Server";
import FinalPageIndexDmDurableDto from "../dto/FinalPageIndexDmDurableDto";
import V1GazEmissionService from "./V1GazEmissionService";
import V4HealthSecurityWorkConditionService from "./V4HealthSecurityWorkConditionService";
import V5BioacumulationToxicityService from "./V5BioacumulationToxicityService";
import IndexDMDurable from "../entities/IndexDMDurable";
import IndexDMDurableDao from "../dao/IndexDMDurableDao";
import V1GazEmission from "../entities/V1GazEmission";
import V4HealthSecurityWorkCondition from "../entities/V4HealthSecurityWorkCondition";
import V5BioacumulationToxicity from "../entities/V5BioacumulationToxicity";
@Service()
export default class IndexDMDurableService {

    @Inject(() => IndexDMDurableDao)
    indexDMDurableDao!: IndexDMDurableDao

    @Inject(() => V1GazEmissionService)
    v1GazEmissionService!: V1GazEmissionService

    /*@Inject(()=>V2GazEmissionService)
    v2GazEmissionService!: V2GazEmissionService

    @Inject(()=>V3GazEmissionService)
    v3GazEmissionService!: V3GazEmissionService*/

    @Inject(() => V4HealthSecurityWorkConditionService)
    v4HealthSecurityWorkConditionService!: V4HealthSecurityWorkConditionService

    @Inject(() => V5BioacumulationToxicityService)
    v5BioacumulationToxicityService!: V5BioacumulationToxicityService

    /*@Inject(()=>V6GazEmissionService)
    v6GazEmissionService!: V6GazEmissionService*/

    getIndexDMDurable = async (idIndexDmDurable: bigint | undefined): Promise<FinalPageIndexDmDurableDto> => {

        if (!idIndexDmDurable) {
            throw new Error('No id provided')
        }
        const indexDMDurable = await this.indexDMDurableDao.findById(idIndexDmDurable, [
            V1GazEmission,
            V4HealthSecurityWorkCondition,
            V5BioacumulationToxicity
        ])
        if (!indexDMDurable) {
            throw new Error('No indexDMDurable found')
        }
        const v1GazEmission = await this.v1GazEmissionService.getVulnerability(indexDMDurable.v1GazEmission.id)
        const v4HealthSecurityWorkCondition = await this.v4HealthSecurityWorkConditionService.getVulnerability(indexDMDurable.v4HealthSecurityWorkCondition.id)
        const v5BioacumulationToxicity = await this.v5BioacumulationToxicityService.getVulnerability(indexDMDurable.v5BioacumulationToxicity.id)
        return new FinalPageIndexDmDurableDto(v1GazEmission, undefined, undefined, v4HealthSecurityWorkCondition, v5BioacumulationToxicity, undefined);
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
                V4HealthSecurityWorkCondition,
                V5BioacumulationToxicity
            ])
            if (!indexDMDurable) {
                throw new Error('No indexDMDurable found')
            }
            return indexDMDurable
        } catch (err) {
            throw new Error('Error while getting indexDMDurable')
        }
    }

}