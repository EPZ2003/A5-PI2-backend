import { Service } from "typedi";
import { AbstractDao } from "../../utils/AbstractDao";
import V3WasteProduction from "../entities/V3WasteProduction";

@Service()
export default class V3WasteProductionDao extends AbstractDao<V3WasteProduction> {
	constructor() {
		super(V3WasteProduction)
	}

	create = async (data: any, options?: any) => {
		return await V3WasteProduction.create(data, options);
	}
}
