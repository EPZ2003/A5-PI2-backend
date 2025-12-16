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
		this.getVulnerability();
	}

	save(){
		this._router.post('',expressAsyncHandler(async(req,res)=>{
			const dto:V4HealthSecurityWorkConditionDto = req.body;
			res.send(await this.V4HealthSecurityWorkConditionService.save(dto)).status(200)
		}))
	}
	getVulnerability(){
		this._router.get('/getV4/:id', expressAsyncHandler(async(req,res) => {
			const id=req.params.id ? BigInt(req.params.id) : undefined
			res.send(await this.V4HealthSecurityWorkConditionService.getVulnerability(id)).status(200)
		}))
	}
}
