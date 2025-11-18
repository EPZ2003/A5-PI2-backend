import { Router } from "express";
import {Constant} from "./constant/Constant.js";
import V1GazEmissionRessources from "./resources/V1GazEmissionResources.js";


export default class AppResources{
	private _router = Router()
	get router() {
		return this._router;
	}
	constructor(){
		this._router.use(Constant.REST_URL+'/v1',new V1GazEmissionRessources().router)
	}
}
