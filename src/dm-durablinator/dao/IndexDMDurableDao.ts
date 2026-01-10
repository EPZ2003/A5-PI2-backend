import { AbstractDao } from "../../utils/AbstractDao";
import IndexDMDurable from "../entities/IndexDMDurable";
import { Service } from "typedi";

@Service()
export default class IndexDMDurableDao extends AbstractDao<IndexDMDurable> {
    constructor() {
        super(IndexDMDurable)
    }
}
