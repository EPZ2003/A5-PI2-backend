import { Router } from "express";
import { Container } from "typedi";
import V3WasteProductionService from "../dm-durablinator/services/V3WasteProductionService";
import expressAsyncHandler from "express-async-handler";
import V3WasteProductionDto from "../dm-durablinator/dto/V3WasteProductionDto";

export default class V3WasteProductionResources {
	private _router = Router()

	private v3WasteProductionService = Container.get(V3WasteProductionService)

	get router() {
		return this._router;
	}

	constructor() {
		this.save();
		this.getVulnerability();
	}

	save() {
		this._router.post('/:idIndexDmDurable', expressAsyncHandler(async (req, res) => {
			const dto: V3WasteProductionDto = req.body;
			const idIndexDmDurable = req.params.idIndexDmDurable ? BigInt(req.params.idIndexDmDurable) : undefined
			res.send(await this.v3WasteProductionService.save(dto, idIndexDmDurable)).status(200)
		}))
	}

	getVulnerability() {
		this._router.get('/getV3/:id', expressAsyncHandler(async (req, res) => {
			const id = req.params.id ? BigInt(req.params.id) : undefined
			res.send(await this.v3WasteProductionService.getVulnerability(id)).status(200)
		}))
	}

}
