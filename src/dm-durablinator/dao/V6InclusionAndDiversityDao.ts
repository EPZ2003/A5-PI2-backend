import { Service } from "typedi";
import { AbstractDao } from "../../utils/AbstractDao";
import V6InclusionAndDiversity from "../entities/V6InclusionAndDiversity";

@Service()
export default class V6InclusionAndDiversityDao extends AbstractDao<V6InclusionAndDiversity> {
	constructor() {
		super(V6InclusionAndDiversity)
	}
}
