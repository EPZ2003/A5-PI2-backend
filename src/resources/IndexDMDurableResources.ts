import { Router } from "express";
import { Container } from "typedi";
import expressAsyncHandler from "express-async-handler";
import IndexDMDurableService from "../dm-durablinator/services/IndexDMDurableService";


export default class IndexDMDurableResources {
    private _router = Router()

    private indexDMDurableService = Container.get(IndexDMDurableService)

    constructor() {
        this.getIndexDMDurable();
        this.newIndexDmDurable();
    }

    get router() {
        return this._router;
    }

    getIndexDMDurable() {
        this._router.get('/all-vulnerabilities/:id', expressAsyncHandler(async (req, res) => {
            const id = req.params.id ? BigInt(req.params.id) : undefined
            res.send(await this.indexDMDurableService.getIndexDMDurable(id)).status(200)
        }))
    }

    newIndexDmDurable() {
        this._router.get('/:nameOfMedicalName', expressAsyncHandler(async (req, res) => {
            const nameOfMedicalName = req.params.nameOfMedicalName ? req.params.nameOfMedicalName : undefined
            if (!nameOfMedicalName) {
                throw new Error('No name of medical name provided')
            }
            res.send(await this.indexDMDurableService.newIndexDmDurable(nameOfMedicalName)).status(200)
        }))
    }

}