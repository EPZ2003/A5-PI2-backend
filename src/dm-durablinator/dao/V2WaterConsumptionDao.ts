import { Service } from "typedi";
import { AbstractDao } from "../../utils/AbstractDao";
import V2WaterConsumption from "../entities/V2WaterConsumption";

@Service()
export default class V2WaterConsumptionDao extends AbstractDao<V2WaterConsumption> {
	constructor() {
		super(V2WaterConsumption)
	}
}
