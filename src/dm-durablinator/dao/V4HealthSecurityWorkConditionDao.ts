import {Service} from "typedi";
import {AbstractDao} from "../../utils/AbstractDao";
import V4HealthSecurityWorkCondition from "../entities/V4HealthSecurityWorkCondition";

@Service()
export default class V4HealthSecurityWorkConditionDao extends AbstractDao<V4HealthSecurityWorkCondition>{
	constructor(){
		super(V4HealthSecurityWorkCondition)
	}
}
