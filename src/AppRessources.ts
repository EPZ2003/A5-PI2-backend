import { Router } from "express";
import {Constant} from "./constant/Constant.js";
import V1GazEmissionRessources from "./resources/V1GazEmissionResources.js";
import V4HealthSecurityWorkConditionRessources from "./resources/V4HealthSecurityWorkConditionRessources.js";


export default class AppResources{
	private _router = Router()
	get router() {
		return this._router;
	}
	constructor(){
		this._router.use(Constant.REST_URL+'/v1',new V1GazEmissionRessources().router),
		this._router.use(Constant.REST_URL+'/v4', new V4HealthSecurityWorkConditionRessources().router)
	}
}
