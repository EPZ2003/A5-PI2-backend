import IndexDMDurable from "../entities/IndexDMDurable";
import V1GazEmission from "../entities/V1GazEmission";
import V4HealthSecurityWorkCondition from "../entities/V4HealthSecurityWorkCondition";
import V5BioacumulationToxicity from "../entities/V5BioacumulationToxicity";

export default class FinalPageIndexDmDurableDto {
    v1GazEmission: number;
    v2: number;
    v3: number;
    v4HealthSecurityWorkCondition: number;
    v5BioacumulationToxicity: number;
    v6: number;


    constructor(v1: number | undefined, v2: undefined, v3: undefined, v4: number | undefined, v5: number | undefined, v6: undefined) {
        this.v1GazEmission = v1 ?? 0;
        this.v2 = v2 ?? 0;
        this.v3 = v3 ?? 0;
        this.v4HealthSecurityWorkCondition = v4 ?? 0;
        this.v5BioacumulationToxicity = v5 ?? 0;
        this.v6 = v6 ?? 0;
    }
}