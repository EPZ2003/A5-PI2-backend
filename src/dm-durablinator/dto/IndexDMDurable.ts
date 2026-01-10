import V1GazEmissionDto from "./V1GazEmissionDto";
import V4HealthSecurityWorkConditionDto from "./V4HealthSecurityWorkConditionDto";
import V5BioacumulationToxicityDto from "./V5BioacumulationToxicityDto";

export default class IndexDMDurable {

    v1GazEmission: V1GazEmissionDto;
    //v2!:
    //v3!:
    v4HealthSecurityWorkCondition: V4HealthSecurityWorkConditionDto;
    v5BioacumulationToxicity: V5BioacumulationToxicityDto;
    //v6!:

    constructor(indexDMDurable: IndexDMDurable) {
        this.v1GazEmission = indexDMDurable.v1GazEmission
        this.v4HealthSecurityWorkCondition = indexDMDurable.v4HealthSecurityWorkCondition
        this.v5BioacumulationToxicity = indexDMDurable.v5BioacumulationToxicity
    }
}