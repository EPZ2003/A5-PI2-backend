import IndexDMDurable from "../entities/IndexDMDurable";
import V1GazEmission from "../entities/V1GazEmission";
import V4HealthSecurityWorkCondition from "../entities/V4HealthSecurityWorkCondition";
import V5BioacumulationToxicity from "../entities/V5BioacumulationToxicity";

export default class FinalPageIndexDmDurableDto {
    v1GazEmission: number;
    v2WaterConsumption: number;
    v3WasteProduction: number;
    v4HealthSecurityWorkCondition: number;
    v5BioacumulationToxicity: number;
    v6InclusionAndDiversity: number;


    constructor(v1: number | undefined, v2: number | undefined, v3: number | undefined, v4: number | undefined, v5: number | undefined, v6: number | undefined) {
        this.v1GazEmission = v1 ?? 0;
        this.v2WaterConsumption = v2 ?? 0;
        this.v3WasteProduction = v3 ?? 0;
        this.v4HealthSecurityWorkCondition = v4 ?? 0;
        this.v5BioacumulationToxicity = v5 ?? 0;
        this.v6InclusionAndDiversity = v6 ?? 0;
    }
}