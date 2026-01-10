import {Service} from "typedi";
import {AbstractDao} from "../../utils/AbstractDao";
import V1GazEmission from "../entities/V1GazEmission";

@Service()
export default class V1GazEmissionDao extends AbstractDao<V1GazEmission>{
    constructor(){
        super(V1GazEmission)
    }

}
