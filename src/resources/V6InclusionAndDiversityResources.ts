import { Router } from "express";
import { Container } from "typedi";
import V6InclusionAndDiversityService from "../dm-durablinator/services/V6InclusionAndDiversityService";
import expressAsyncHandler from "express-async-handler";
import V6InclusionAndDiversityDto from "../dm-durablinator/dto/V6InclusionAndDiversityDto";

export default class V6InclusionAndDiversityResources {
	private _router = Router()

	private v6InclusionAndDiversityService = Container.get(V6InclusionAndDiversityService)

	get router() {
		return this._router;
	}

	constructor() {
		this.save();
		this.getByDmId();
		this.getVulnerability();
	}

	/**
	 * POST /v6/{dmId}
	 * Create or update V6 inclusion and diversity data for a medical device
	 */
	save() {
		this._router.post('/:dmId', expressAsyncHandler(async (req, res) => {
			const dto: V6InclusionAndDiversityDto = req.body;
			const dmId = req.params.dmId ? BigInt(req.params.dmId) : undefined;
			try {
				const result = await this.v6InclusionAndDiversityService.save(dto, dmId);
				res.status(200).send(result);
			} catch (error: any) {
				res.status(400).send({ error: error.message });
			}
		}))
	}

	/**
	 * GET /v6/{dmId}
	 * Retrieve existing V6 inclusion and diversity data for a medical device
	 */
	getByDmId() {
		this._router.get('/:dmId', expressAsyncHandler(async (req, res) => {
			const dmId = req.params.dmId ? BigInt(req.params.dmId) : undefined;
			try {
				const result = await this.v6InclusionAndDiversityService.findByIndexDmDurableId(dmId);
				if (!result) {
					res.status(404).send({ message: 'V6 data not found for this medical device' });
				} else {
					res.status(200).send(result);
				}
			} catch (error: any) {
				res.status(500).send({ error: error.message });
			}
		}))
	}

	/**
	 * GET /v6/getV6/{id}
	 * Calculate and return vulnerability score V6 (out of 20)
	 */
	getVulnerability() {
		this._router.get('/getV6/:id', expressAsyncHandler(async (req, res) => {
			const id = req.params.id ? BigInt(req.params.id) : undefined;
			try {
				const result = await this.v6InclusionAndDiversityService.getVulnerability(id);
				res.status(200).send({ vulnerability: result });
			} catch (error: any) {
				res.status(500).send({ error: error.message });
			}
		}))
	}
}
