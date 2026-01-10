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
        this.getDataFromIndexDMDurable();
        this.getAllIndexDMDurable();
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
        this._router.get('/newDmDurable/:nameOfMedicalName', expressAsyncHandler(async (req, res) => {
            const nameOfMedicalName = req.params.nameOfMedicalName ? req.params.nameOfMedicalName : undefined
            if (!nameOfMedicalName) {
                throw new Error('No name of medical name provided')
            }
            res.send(await this.indexDMDurableService.newIndexDmDurable(nameOfMedicalName)).status(200)
        }))
    }

    getDataFromIndexDMDurable() {
        this._router.get('/data/:id', expressAsyncHandler(async (req, res) => {
            const id = req.params.id ? BigInt(req.params.id) : undefined
            res.send(await this.indexDMDurableService.getDataFromIndexDMDurable(id)).status(200)
        }))
    }

    getAllIndexDMDurable() {
        this._router.get('/all-index-dm-durable', expressAsyncHandler(async (req, res) => {
            res.send(await this.indexDMDurableService.getAllIndexDMDurable()).status(200)
        }))
    }

}