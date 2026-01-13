import { Inject, Service } from "typedi";
import { server } from "../../Server";
import V3WasteProductionDto from "../dto/V3WasteProductionDto";
import V3WasteProductionDao from "../dao/V3WasteProductionDao";
import V3WasteProduction from "../entities/V3WasteProduction";
import IndexDMDurableDao from "../dao/IndexDMDurableDao";
import IndexDMDurable from "../entities/IndexDMDurable";

@Service()
export default class V3WasteProductionService {
	@Inject(() => V3WasteProductionDao)
	v3WasteProductionDao!: V3WasteProductionDao

	@Inject(() => IndexDMDurableDao)
	indexDMDurableDao!: IndexDMDurableDao

	save = async (dto: V3WasteProductionDto, idIndexDmDurable: bigint | undefined) => {
		return await server.sequelize.transaction(async t => {
			try {
				if (!idIndexDmDurable) {
					throw new Error('No indexDmDurable provided')
				}
				const indexDmDurable: IndexDMDurable | null = await this.indexDMDurableDao.findById(idIndexDmDurable)
				if (!indexDmDurable) {
					throw new Error('IndexDmDurable not found')
				}

				// Critère 1 - Élément 1: Proportion de matériaux recyclés
				const recyclableProportionPoints = this.calculateRecyclableProportionPoints(
					dto.containsRecycledMaterial,
					dto.technicalConstraintsPreventRecycled
				);

				// Critère 1 - Élément 2: Séparabilité des parties du dispositif
				const separabilityPoints = this.calculateSeparabilityPoints(
					dto.separabilitySituation,
					dto.hasSeparationProcedure
				);

				// Critère 2 - Élément 1: Proportion de matériau recyclable
				const recyclableMaterialRate = this.calculateRecyclableMaterialRate(
					dto.packagingRecyclableMass,
					dto.packagingTotalMass
				);
				const recyclableMaterialPoints = this.calculateRecyclableMaterialPoints(
					recyclableMaterialRate,
					dto.hasNationalRecyclingChannel
				);

				// Critère 2 - Élément 2: Matériaux recyclés utilisés pour l'emballage
				const recycledMaterialRate = this.calculateRecycledMaterialRate(
					dto.packagingRecycledMass,
					dto.packagingTotalMassForRecycled
				);
				const recycledMaterialPoints = this.calculateRecycledMaterialPoints(recycledMaterialRate);

				// Calcul du score final de la vulnérabilité V3
				const wasteProductionMastery = this.calculateWasteProductionMastery(
					recyclableProportionPoints,
					separabilityPoints,
					recyclableMaterialPoints,
					recycledMaterialPoints
				);

				let v3WasteProduction: V3WasteProduction | null;

			// Si mise à jour (id > 0)
			if (dto.id && dto.id > 0) {
					v3WasteProduction = await this.v3WasteProductionDao.findById(BigInt(dto.id))
					if (!v3WasteProduction) {
						throw new Error('V3 not found')
					}
					await v3WasteProduction.update({
						indexDMDurableId: indexDmDurable.id,
						// Critère 1 - Élément 1
						containsRecycledMaterial: dto.containsRecycledMaterial,
						technicalConstraintsPreventRecycled: dto.technicalConstraintsPreventRecycled,
						recyclableProportionPoints,
						// Critère 1 - Élément 2
						separabilitySituation: dto.separabilitySituation,
						hasSeparationProcedure: dto.hasSeparationProcedure,
						separabilityPoints,
						// Critère 2 - Élément 1
						packagingRecyclableMass: dto.packagingRecyclableMass,
						packagingTotalMass: dto.packagingTotalMass,
						hasNationalRecyclingChannel: dto.hasNationalRecyclingChannel,
						recyclableMaterialRate,
						recyclableMaterialPoints,
						// Critère 2 - Élément 2
						packagingRecycledMass: dto.packagingRecycledMass,
						packagingTotalMassForRecycled: dto.packagingTotalMassForRecycled,
						recycledMaterialRate,
						recycledMaterialPoints,
						// Score final
						wasteProductionMastery
					}, { transaction: t })
				} else {
					// Création
					const createdProduction = await this.v3WasteProductionDao.create({
						indexDMDurableId: indexDmDurable.id,
						// Critère 1 - Élément 1
						containsRecycledMaterial: dto.containsRecycledMaterial,
						technicalConstraintsPreventRecycled: dto.technicalConstraintsPreventRecycled,
						recyclableProportionPoints,
						// Critère 1 - Élément 2
						separabilitySituation: dto.separabilitySituation,
						hasSeparationProcedure: dto.hasSeparationProcedure,
						separabilityPoints,
						// Critère 2 - Élément 1
						packagingRecyclableMass: dto.packagingRecyclableMass,
						packagingTotalMass: dto.packagingTotalMass,
						hasNationalRecyclingChannel: dto.hasNationalRecyclingChannel,
						recyclableMaterialRate,
						recyclableMaterialPoints,
						// Critère 2 - Élément 2
						packagingRecycledMass: dto.packagingRecycledMass,
						packagingTotalMassForRecycled: dto.packagingTotalMassForRecycled,
						recycledMaterialRate,
						recycledMaterialPoints,
						// Score final
						wasteProductionMastery
					}, { transaction: t })
					v3WasteProduction = createdProduction || null
				}

				if (!v3WasteProduction) {
					throw new Error('V3 creation failed')
				}

				return new V3WasteProductionDto(v3WasteProduction);
			} catch (error) {
				throw error;
			}
		});
	}

	getVulnerability = async (id: bigint | undefined) => {
		try {
			if (!id) {
				throw new Error('No id provided')
			}
			const v3WasteProduction: V3WasteProduction | null = await this.v3WasteProductionDao.findById(id)
			if (!v3WasteProduction) {
				throw new Error('V3 not found')
			}
			return v3WasteProduction.wasteProductionMastery || 0;
		} catch (error) {
			throw error;
		}
	}

	/**
	 * Critère 1 - Élément 1: Proportion de matériaux recyclés (AFNOR SPEC 2313)
	 * Si technicalConstraintsPreventRecycled === true : 5 points
	 * Sinon, si containsRecycledMaterial === true : 5 points
	 * Sinon (containsRecycledMaterial === false) : 0 point
	 */
	private calculateRecyclableProportionPoints(
		containsRecycledMaterial: boolean,
		technicalConstraintsPreventRecycled: boolean
	): number {
		if (technicalConstraintsPreventRecycled === true) {
			return 5;
		}
		if (containsRecycledMaterial === true) {
			return 5;
		}
		return 0;
	}

	/**
	 * Critère 1 - Élément 2: Séparabilité des parties du dispositif (AFNOR SPEC 2313)
	 * Si separabilitySituation === "A" : 5 points
	 * Si separabilitySituation === "B" :
	 *   Si hasSeparationProcedure === true : 3 points
	 *   Sinon : 2 points
	 * Si separabilitySituation === "C" : 0 point
	 */
	private calculateSeparabilityPoints(
		separabilitySituation: string,
		hasSeparationProcedure?: boolean
	): number {
		switch (separabilitySituation) {
			case 'A':
				return 5;
			case 'B':
				return hasSeparationProcedure === true ? 3 : 2;
			case 'C':
				return 0;
			default:
				return 0;
		}
	}

	/**
	 * Calcul du taux de matériaux recyclables
	 * Trec = (packagingRecyclableMass / packagingTotalMass) × 100
	 */
	private calculateRecyclableMaterialRate(recyclableMass: number, totalMass: number): number {
		if (totalMass === 0) {
			return 0;
		}
		return (recyclableMass / totalMass) * 100;
	}

	/**
	 * Critère 2 - Élément 1: Proportion de matériau recyclable (AFNOR SPEC 2313)
	 * Si hasNationalRecyclingChannel === false OU Trec entre 0-1% : 0 point
	 * Si Trec entre 1-33% : 1 point
	 * Si Trec entre 33-66% : 3 points
	 * Si Trec entre 66-100% : 5 points
	 */
	private calculateRecyclableMaterialPoints(
		recyclableMaterialRate: number,
		hasNationalRecyclingChannel: boolean
	): number {
		if (hasNationalRecyclingChannel === false) {
			return 0;
		}

		if (recyclableMaterialRate > 0 && recyclableMaterialRate < 1) {
			return 0;
		}
		if (recyclableMaterialRate >= 1 && recyclableMaterialRate < 33) {
			return 1;
		}
		if (recyclableMaterialRate >= 33 && recyclableMaterialRate < 66) {
			return 3;
		}
		if (recyclableMaterialRate >= 66 && recyclableMaterialRate <= 100) {
			return 5;
		}

		return 0;
	}

	/**
	 * Calcul du taux de matériaux recyclés
	 * Trecyclé = (packagingRecycledMass / packagingTotalMassForRecycled) × 100
	 */
	private calculateRecycledMaterialRate(recycledMass: number, totalMass: number): number {
		if (totalMass === 0) {
			return 0;
		}
		return (recycledMass / totalMass) * 100;
	}

	/**
	 * Critère 2 - Élément 2: Matériaux recyclés utilisés pour l'emballage (AFNOR SPEC 2313)
	 * Si Trecyclé entre 0-1% : 0 point
	 * Si Trecyclé entre 1-33% : 1 point
	 * Si Trecyclé entre 33-66% : 3 points
	 * Si Trecyclé entre 66-100% : 5 points
	 */
	private calculateRecycledMaterialPoints(recycledMaterialRate: number): number {
		if (recycledMaterialRate > 0 && recycledMaterialRate < 1) {
			return 0;
		}
		if (recycledMaterialRate >= 1 && recycledMaterialRate < 33) {
			return 1;
		}
		if (recycledMaterialRate >= 33 && recycledMaterialRate < 66) {
			return 3;
		}
		if (recycledMaterialRate >= 66 && recycledMaterialRate <= 100) {
			return 5;
		}

		return 0;
	}

	/**
	 * Calcul du score final de la vulnérabilité V3 (AFNOR SPEC 2313)
	 * Score final = somme des 4 éléments (max 20 points)
	 */
	private calculateWasteProductionMastery(
		recyclableProportionPoints: number,
		separabilityPoints: number,
		recyclableMaterialPoints: number,
		recycledMaterialPoints: number
	): number {
		return recyclableProportionPoints + separabilityPoints + recyclableMaterialPoints + recycledMaterialPoints;
	}
}
