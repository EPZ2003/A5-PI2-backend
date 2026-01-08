import { Router } from "express";
import { Container } from "typedi";
import expressAsyncHandler from "express-async-handler";
import V5BioacumulationToxicityDto from "../dm-durablinator/dto/V5BioacumulationToxicityDto";
import V5BioacumulationToxicityService from "../dm-durablinator/services/V5BioacumulationToxicityService";

export default class V5BioaccumulationResources {

    private _router = Router()

    private v5BioacumulationToxicityService = Container.get(V5BioacumulationToxicityService)

    get router() {
        return this._router;
    }

    constructor() {
        this.save();
        this.getVulnerability();
    }

    save() {
        this._router.post('', expressAsyncHandler(async (req, res) => {
            const dto: V5BioacumulationToxicityDto = req.body;
            res.send(await this.v5BioacumulationToxicityService.save(dto)).status(200)
        }))
    }

    getVulnerability() {
        this._router.get('/getV5/:id', expressAsyncHandler(async (req, res) => {
            const id = req.params.id ? BigInt(req.params.id) : undefined
            res.send(await this.v5BioacumulationToxicityService.getVulnerability(id)).status(200)
        }))
    }
}
