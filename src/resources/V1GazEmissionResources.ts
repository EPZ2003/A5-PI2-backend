import {Router} from "express";
import {Container} from "typedi";
import V1GazEmissionService from "../dm-durablinator/services/V1GazEmissionService";
import expressAsyncHandler from "express-async-handler";
import V1GazEmissionDto from "../dm-durablinator/dto/V1GazEmissionDto";


export default class V1GazEmissionRessources {
	private _router = Router()
	
	private v1GazEmissionService = Container.get(V1GazEmissionService)


	get router(){
		return this._router;	
	}

	constructor(){
		this.save()
	}

	save(){
		this._router.post('',expressAsyncHandler(async(req,res) => {
			const dto: V1GazEmissionDto = req.body;
			res.send(await this.v1GazEmissionService.save(dto)).status(200)
		}))
	}

}
