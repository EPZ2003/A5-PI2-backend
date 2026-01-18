import V3WasteProduction from "../entities/V3WasteProduction";

export default class V3WasteProductionDto {
	id?: bigint;

	// Critère 1 - Dispositif médical: Élément 1 - Proportion de matériaux recyclés
	containsRecycledMaterial!: boolean;
	technicalConstraintsPreventRecycled!: boolean;
	recyclableProportionPoints?: number;

	// Critère 1 - Dispositif médical: Élément 2 - Séparabilité des parties du dispositif
	separabilitySituation!: string; // Situation A, B, or C
	hasSeparationProcedure?: boolean;
	separabilityPoints?: number;

	// Critère 2 - Emballage: Élément 1 - Proportion de matériau recyclable
	packagingRecyclableMass!: number;
	packagingTotalMass!: number;
	hasNationalRecyclingChannel!: boolean;
	recyclableMaterialRate?: number;
	recyclableMaterialPoints?: number;

	// Critère 2 - Emballage: Élément 2 - Matériaux recyclés utilisés pour l'emballage
	packagingRecycledMass!: number;
	packagingTotalMassForRecycled!: number;
	recycledMaterialRate?: number;
	recycledMaterialPoints?: number;

	// Score final de la vulnérabilité V3
	wasteProductionMastery?: number;

	constructor(v3WasteProduction?: V3WasteProduction) {
		if (v3WasteProduction) {
			this.id = v3WasteProduction.id;
			
			// Critère 1 - Élément 1
			this.containsRecycledMaterial = v3WasteProduction.containsRecycledMaterial;
			this.technicalConstraintsPreventRecycled = v3WasteProduction.technicalConstraintsPreventRecycled;
			if (v3WasteProduction.recyclableProportionPoints !== undefined) {
				this.recyclableProportionPoints = v3WasteProduction.recyclableProportionPoints;
			}
			
			// Critère 1 - Élément 2
			this.separabilitySituation = v3WasteProduction.separabilitySituation;
			if (v3WasteProduction.hasSeparationProcedure !== undefined) {
				this.hasSeparationProcedure = v3WasteProduction.hasSeparationProcedure;
			}
			if (v3WasteProduction.separabilityPoints !== undefined) {
				this.separabilityPoints = v3WasteProduction.separabilityPoints;
			}
			
			// Critère 2 - Élément 1
			this.packagingRecyclableMass = v3WasteProduction.packagingRecyclableMass;
			this.packagingTotalMass = v3WasteProduction.packagingTotalMass;
			this.hasNationalRecyclingChannel = v3WasteProduction.hasNationalRecyclingChannel;
			if (v3WasteProduction.recyclableMaterialRate !== undefined) {
				this.recyclableMaterialRate = v3WasteProduction.recyclableMaterialRate;
			}
			if (v3WasteProduction.recyclableMaterialPoints !== undefined) {
				this.recyclableMaterialPoints = v3WasteProduction.recyclableMaterialPoints;
			}
			
			// Critère 2 - Élément 2
			this.packagingRecycledMass = v3WasteProduction.packagingRecycledMass;
			this.packagingTotalMassForRecycled = v3WasteProduction.packagingTotalMassForRecycled;
			if (v3WasteProduction.recycledMaterialRate !== undefined) {
				this.recycledMaterialRate = v3WasteProduction.recycledMaterialRate;
			}
			if (v3WasteProduction.recycledMaterialPoints !== undefined) {
				this.recycledMaterialPoints = v3WasteProduction.recycledMaterialPoints;
			}
			
			if (v3WasteProduction.wasteProductionMastery !== undefined) {
				this.wasteProductionMastery = v3WasteProduction.wasteProductionMastery;
			}
		}
	}
}
