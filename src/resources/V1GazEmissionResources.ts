import { Router } from "express";
import { Container } from "typedi";
import V1GazEmissionService from "../dm-durablinator/services/V1GazEmissionService";
import expressAsyncHandler from "express-async-handler";
import V1GazEmissionDto from "../dm-durablinator/dto/V1GazEmissionDto";


export default class V1GazEmissionRessources {
	private _router = Router()

	private v1GazEmissionService = Container.get(V1GazEmissionService)


	get router() {
		return this._router;
	}

	constructor() {
		this.save();
		this.getVulnerability();
	}

	save() {
		this._router.post('/:idIndexDmDurable', expressAsyncHandler(async (req, res) => {
			const dto: V1GazEmissionDto = req.body;
			const idIndexDmDurable = req.params.idIndexDmDurable ? BigInt(req.params.idIndexDmDurable) : undefined
			res.send(await this.v1GazEmissionService.save(dto, idIndexDmDurable)).status(200)
		}))
	}

	getVulnerability() {
		this._router.get('/getV1/:id', expressAsyncHandler(async (req, res) => {
			const id = req.params.id ? BigInt(req.params.id) : undefined
			res.send(await this.v1GazEmissionService.getVulnerability(id)).status(200)
		}))
	}

}
