import {Router} from "express";
import {Container} from "typedi";
import V4HealthSecurityWorkConditionService from '../dm-durablinator/services/V4HealthSecurityWorkConditionService'
import expressAsyncHandler from "express-async-handler";
import V4HealthSecurityWorkConditionDto from "../dm-durablinator/dto/V4HealthSecurityWorkConditionDto";
export default class V4HealthSecurityWorkConditionRessources {
	
	private _router = Router()

	private V4HealthSecurityWorkConditionService = Container.get(V4HealthSecurityWorkConditionService)

	get router(){
		return this._router;
	}
	constructor(){
		this.save();
	}

	save(){
		this._router.post('',expressAsyncHandler(async(req,res)=>{
			const dto:V4HealthSecurityWorkConditionDto = req.body;
			res.send(await this.V4HealthSecurityWorkConditionService.save(dto)).status(200)
		}))
	}
}
