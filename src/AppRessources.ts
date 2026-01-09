import { Router } from "express";
import { Constant } from "./constant/Constant.js";
import V1GazEmissionRessources from "./resources/V1GazEmissionResources.js";
import V4HealthSecurityWorkConditionRessources from "./resources/V4HealthSecurityWorkConditionRessources.js";
import V5BioaccumulationResources from "./resources/V5BioaccumulationResources.js";
import IndexDMDurableResources from "./resources/IndexDMDurableResources.js";


export default class AppResources {
	private _router = Router()
	get router() {
		return this._router;
	}
	constructor() {
		this._router.use(Constant.REST_URL + '/v1', new V1GazEmissionRessources().router),
			this._router.use(Constant.REST_URL + '/v4', new V4HealthSecurityWorkConditionRessources().router),
			this._router.use(Constant.REST_URL + '/v5', new V5BioaccumulationResources().router),
			this._router.use(Constant.REST_URL + '/index-dm-durable', new IndexDMDurableResources().router)
	}
}
