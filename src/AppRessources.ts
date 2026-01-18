import { Router } from "express";
import { Constant } from "./constant/Constant.js";
import V1GazEmissionRessources from "./resources/V1GazEmissionResources.js";
import V2WaterConsumptionResources from "./resources/V2WaterConsumptionResources.js";
import V3WasteProductionResources from "./resources/V3WasteProductionResources.js";
import V4HealthSecurityWorkConditionRessources from "./resources/V4HealthSecurityWorkConditionRessources.js";
import V5BioaccumulationResources from "./resources/V5BioaccumulationResources.js";
import V6InclusionAndDiversityResources from "./resources/V6InclusionAndDiversityResources.js";
import IndexDMDurableResources from "./resources/IndexDMDurableResources.js";


export default class AppResources {
	private _router = Router()
	get router() {
		return this._router;
	}
	constructor() {
		this._router.use(Constant.REST_URL + '/v1', new V1GazEmissionRessources().router),
			this._router.use(Constant.REST_URL + '/v2', new V2WaterConsumptionResources().router),
			this._router.use(Constant.REST_URL + '/v3', new V3WasteProductionResources().router),
			this._router.use(Constant.REST_URL + '/v4', new V4HealthSecurityWorkConditionRessources().router),
			this._router.use(Constant.REST_URL + '/v5', new V5BioaccumulationResources().router),
			this._router.use(Constant.REST_URL + '/v6', new V6InclusionAndDiversityResources().router),
			this._router.use(Constant.REST_URL + '/index-dm-durable', new IndexDMDurableResources().router)
	}
}
