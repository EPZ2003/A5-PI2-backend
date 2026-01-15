import { Inject, Service } from "typedi";
import { server } from "../../Server";
import V2WaterConsumptionDto from "../dto/V2WaterConsumptionDto";
import V2WaterConsumptionDao from "../dao/V2WaterConsumptionDao";
import V2WaterConsumption from "../entities/V2WaterConsumption";
import IndexDMDurableDao from "../dao/IndexDMDurableDao";
import IndexDMDurable from "../entities/IndexDMDurable";

@Service()
export default class V2WaterConsumptionService {
	@Inject(() => V2WaterConsumptionDao)
	v2WaterConsumptionDao!: V2WaterConsumptionDao

	@Inject(() => IndexDMDurableDao)
	indexDMDurableDao!: IndexDMDurableDao

	save = async (dto: V2WaterConsumptionDto, idIndexDmDurable: bigint | undefined) => {
		return await server.sequelize.transaction(async t => {
			try {
				if (!idIndexDmDurable) {
					throw new Error('No indexDmDurable provided')
				}


				const noWaterNeed = dto.noWaterNeed === true;
				const totalReusedWater = dto.totalReusedWater ?? null;
				const totalConsumedWater = dto.totalConsumedWater ?? null;

				// Validation des champs
				this.validateInput({ ...dto, noWaterNeed, totalReusedWater, totalConsumedWater });

				const indexDmDurable: IndexDMDurable | null = await this.indexDMDurableDao.findById(idIndexDmDurable)
				if (!indexDmDurable) {
					throw new Error('IndexDmDurable not found')
				}

				let v2WaterConsumption: V2WaterConsumption | null;

				// Calculate reusability water points
				const reusabilityWaterPoints = this.calculateReusabilityWaterPoints(noWaterNeed, totalReusedWater, totalConsumedWater);

				// Calculate vulnerability
				const vulnerability = this.calculateVulnerability(dto.waterMadeQuantity, dto.waterConsommationQuantity, reusabilityWaterPoints);

				// First check if an entity already exists for this indexDMDurableId
				const existingEntity = await this.v2WaterConsumptionDao.findOne({ indexDMDurableId: idIndexDmDurable });

				if (existingEntity) {
					// Update existing entity
					await existingEntity.update({
						indexDMDurableId: indexDmDurable.id,
						noWaterNeed: noWaterNeed,
						waterMadeQuantity: dto.waterMadeQuantity,
						waterConsommationQuantity: dto.waterConsommationQuantity,
						totalReusedWater: totalReusedWater,
						totalConsumedWater: totalConsumedWater,
						reusabilityWaterPoints: reusabilityWaterPoints,
						vulnerability: vulnerability
					}, { transaction: t })
					v2WaterConsumption = existingEntity;
				} else {
					// Create new entity
					v2WaterConsumption = V2WaterConsumption.build({
						indexDMDurableId: indexDmDurable.id,
						noWaterNeed: noWaterNeed,
						waterMadeQuantity: dto.waterMadeQuantity,
						waterConsommationQuantity: dto.waterConsommationQuantity,
						totalReusedWater: totalReusedWater,
						totalConsumedWater: totalConsumedWater,
						reusabilityWaterPoints: reusabilityWaterPoints,
						vulnerability: vulnerability
					})
					await v2WaterConsumption.save({ transaction: t })
				}

				return v2WaterConsumption;
			} catch (err) {
				console.log(err)
				throw err;
			}
		})
	}

	findByIndexDmDurableId = async (indexDMDurableId: bigint | undefined) => {
		try {
			if (!indexDMDurableId) {
				throw new Error('No indexDMDurableId provided')
			}
			const entity = await this.v2WaterConsumptionDao.findOne({ indexDMDurableId: indexDMDurableId })
			return entity;
		} catch (err) {
			console.log(err)
			throw err;
		}
	}

	getVulnerability = async (id: bigint | undefined): Promise<number> => {
		try {
			if (!id) {
				throw new Error('No provided id')
			}
			const entity = await this.v2WaterConsumptionDao.findById(id)
			if (entity) {
				const v2Data = entity.dataValues
				if (v2Data.vulnerability !== undefined) {
					return Math.round(v2Data.vulnerability * 100) / 100;
				} else {
					throw new Error('No vulnerability calculated')
				}
			} else {
				throw new Error('No V2 entity found')
			}
		} catch (err) {
			console.log(err)
			throw err;
		}
	}

	/**
	 * Calculate reusability water points based on Table 11
	 * @param totalReusedWater - Amount of water reused
	 * @param totalConsumedWater - Total amount of water consumed
	 * @returns Points (0, 1, 3, or 5)
	 */
	private calculateReusabilityWaterPoints = (noWaterNeed: boolean, totalReusedWater?: number | null, totalConsumedWater?: number | null): number => {
		if (noWaterNeed) {
			return 5;
		}

		// If no data provided or totalConsumedWater is 0, return 0
		if (totalReusedWater === undefined || totalReusedWater === null || totalConsumedWater === undefined || totalConsumedWater === null || totalConsumedWater === 0) {
			return 0;
		}

		// Calculate rate as percentage
		const rate = (totalReusedWater / totalConsumedWater) * 100;

		// Apply scoring according to Table 11
		if (rate >= 0 && rate < 1) {
			return 0;
		} else if (rate >= 1 && rate < 30) {
			return 1;
		} else if (rate >= 30 && rate < 60) {
			return 3;
		} else if (rate >= 60 && rate <= 100) {
			return 5;
		}

		return 0;
	}

	/**
	 * Calculate vulnerability score for V2
	 * Formula: (waterMadeQuantity + waterConsommationQuantity + reusabilityWaterPoints) × 20/15
	 * @param waterMadeQuantity - Points for water made (0, 2, 4, or 5)
	 * @param waterConsommationQuantity - Points for water consumption (0, 2, or 5)
	 * @param reusabilityWaterPoints - Points for water reusability (0, 1, 3, or 5)
	 * @returns Vulnerability score (out of 20)
	 */
	private calculateVulnerability = (waterMadeQuantity: number, waterConsommationQuantity: number, reusabilityWaterPoints: number): number => {
		const sum = waterMadeQuantity + waterConsommationQuantity + reusabilityWaterPoints;
		const vulnerability = (sum * 20) / 15;
		return Math.round(vulnerability * 100) / 100; // Round to 2 decimal places
	}

	/**
	 * Validate input data according to specifications
	 */
	private validateInput = (dto: V2WaterConsumptionDto) => {
		if (dto.noWaterNeed === undefined || dto.noWaterNeed === null) {
			throw new Error('noWaterNeed must be provided');
		}

		if (typeof dto.noWaterNeed !== 'boolean') {
			throw new Error('noWaterNeed must be boolean');
		}

		// Validate waterMadeQuantity: must be 0, 2, 4, or 5
		if (![0, 2, 4, 5].includes(dto.waterMadeQuantity)) {
			throw new Error('waterMadeQuantity must be 0, 2, 4, or 5');
		}

		// Validate waterConsommationQuantity: must be 0, 2, or 5
		if (![0, 2, 5].includes(dto.waterConsommationQuantity)) {
			throw new Error('waterConsommationQuantity must be 0, 2, or 5');
		}


		const hasWaterData = dto.totalReusedWater !== undefined && dto.totalReusedWater !== null
			&& dto.totalConsumedWater !== undefined && dto.totalConsumedWater !== null;

		if (dto.totalReusedWater !== undefined && dto.totalReusedWater !== null && dto.totalReusedWater < 0) {
			throw new Error('totalReusedWater must be >= 0');
		}

		if (dto.totalConsumedWater !== undefined && dto.totalConsumedWater !== null && dto.totalConsumedWater < 0) {
			throw new Error('totalConsumedWater must be >= 0');
		}

		if (!dto.noWaterNeed) {
			if (!hasWaterData) {
				throw new Error('totalReusedWater and totalConsumedWater are required when noWaterNeed is false');
			}

			if (dto.totalConsumedWater !== null && dto.totalConsumedWater !== undefined && dto.totalConsumedWater <= 0) {
				throw new Error('totalConsumedWater must be greater than 0 when noWaterNeed is false');
			}
		}
	}
}
