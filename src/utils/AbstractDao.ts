import {BulkCreateOptions, Transaction, WhereOptions} from "sequelize";
import {Model} from "sequelize-typescript";
import {Service} from "typedi";

@Service()
export class AbstractDao<T extends Model>{
	//Creation of the model instance 
	model: {new(): T} & typeof Model

	constructor(model: {new(): T} & typeof Model){
		this.model = model;
	}

	async findAll(where?: any, includes: any[] = [], order?: any, t?: Transaction): Promise<T[]> {
		if (t) {
			return await this.model.findAll<T>({ where: where, include: includes, order: order, transaction: t })
		} else {
			return await this.model.findAll<T>({ where: where, include: includes, order: order })
		}
	}

	async findById(id: bigint, includes: any[] = [], t?: Transaction): Promise<T | null> {
		if (t) {
			return await this.model.findByPk<T>(id.toString(), { transaction: t, include: includes })
		} else {
			return await this.model.findByPk<T>(id.toString(), { include: includes })
		}
	};

	async findOne(where?: any, includes: any[] = [], t?: Transaction): Promise<T | null> {
		if (t) {
			return await this.model.findOne<T>({ where: where, include: includes, transaction: t })
		} else {
			return await this.model.findOne<T>({ where: where, include: includes })
		}
	};
	async save(obj: any, t: Transaction): Promise<T> {
		return await this.model.create<T>(obj, { transaction: t })
	};
	async update(obj: any, where: WhereOptions, t: Transaction): Promise<void> {
		await this.model.update<T>(obj, { where: where, transaction: t })
	}

	async bulkCreate(array: any[], options: BulkCreateOptions): Promise<Array<T>> {
		return await this.model.bulkCreate<T>(array, options)
	};

	async delete(where: WhereOptions, t: Transaction) {
		return await this.model.destroy({ where: where, transaction: t })
	};
}
