import { Router } from "express";
import { Container } from "typedi";
import V2WaterConsumptionService from "../dm-durablinator/services/V2WaterConsumptionService";
import expressAsyncHandler from "express-async-handler";
import V2WaterConsumptionDto from "../dm-durablinator/dto/V2WaterConsumptionDto";

export default class V2WaterConsumptionResources {
	private _router = Router()

	private v2WaterConsumptionService = Container.get(V2WaterConsumptionService)

	get router() {
		return this._router;
	}

	constructor() {
		this.save();
		this.getByDmId();
		this.getVulnerability();
	}

	/**
	 * POST /v2/{dmId}
	 * Create or update V2 water consumption data for a medical device
	 */
	save() {
		this._router.post('/:dmId', expressAsyncHandler(async (req, res) => {
			const dto: V2WaterConsumptionDto = req.body;
			const dmId = req.params.dmId ? BigInt(req.params.dmId) : undefined;
			const result = await this.v2WaterConsumptionService.save(dto, dmId);
			res.status(200).send(result);
		}))
	}

	/**
	 * GET /v2/{dmId}
	 * Retrieve existing V2 water consumption data for a medical device
	 */
	getByDmId() {
		this._router.get('/:dmId', expressAsyncHandler(async (req, res) => {
			const dmId = req.params.dmId ? BigInt(req.params.dmId) : undefined;
			const result = await this.v2WaterConsumptionService.findByIndexDmDurableId(dmId);
			if (!result) {
				res.status(404).send({ message: 'V2 data not found for this medical device' });
			} else {
				res.status(200).send(result);
			}
		}))
	}

	/**
	 * GET /v2/getV2/{id}
	 * Calculate and return vulnerability score 2 (out of 20)
	 */
	getVulnerability() {
		this._router.get('/getV2/:id', expressAsyncHandler(async (req, res) => {
			const id = req.params.id ? BigInt(req.params.id) : undefined;
			const result = await this.v2WaterConsumptionService.getVulnerability(id);
			res.status(200).send(result);
		}))
	}
}
