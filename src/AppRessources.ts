import {Router} from "express"

export default class AppResources{
	private _router = Router()
	get router() {
		return this._router;
	}

	constructor(){
		//WHERE TO PUT THE DIFFERENT RESSOURCES
	}
}
