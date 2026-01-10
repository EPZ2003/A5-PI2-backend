import {Service} from "typedi";
import {AbstractDao} from "../../utils/AbstractDao";
import V5BioacumulationToxicity from "../entities/V5BioacumulationToxicity";

@Service()
export default class V5BioacumulationToxicityDao extends AbstractDao<V5BioacumulationToxicity>{
	constructor(){
		super(V5BioacumulationToxicity)
	}
}
