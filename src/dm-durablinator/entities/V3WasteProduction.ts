import { BelongsTo, Column, ForeignKey, Table } from "sequelize-typescript";
import AbstractEntity from "../../utils/AbstractEntity";
import { Constant } from "../../constant/Constant";
import { DataTypes } from "sequelize";
import IndexDMDurable from "./IndexDMDurable";

@Table({
	timestamps: false,
	tableName: Constant.PREFIX_TABLE + 'v3_waste_production',
	freezeTableName: true
})
export default class V3WasteProduction extends AbstractEntity {
	@ForeignKey(() => IndexDMDurable)
	@Column
	indexDMDurableId!: bigint;

	@BelongsTo(() => IndexDMDurable)
	indexDMDurable!: IndexDMDurable;

	// Critère 1: Dispositif médical - Élément 1 Proportion de matériaux recyclés
	@Column(DataTypes.BOOLEAN)
	containsRecycledMaterial!: boolean; // true si le dispositif contient des matériaux recyclés

	@Column(DataTypes.BOOLEAN)
	technicalConstraintsPreventRecycled!: boolean; // true si des contraintes techniques empêchent l'utilisation de recyclés

	@Column(DataTypes.FLOAT)
	recyclableProportionPoints?: number; // Points calculés (0 ou 5)

	// Critère 1: Dispositif médical - Élément 2 Séparabilité des parties du dispositif
	@Column(DataTypes.STRING)
	separabilitySituation!: string; // Situation A, B, or C

	@Column(DataTypes.BOOLEAN)
	hasSeparationProcedure?: boolean; // Pour situation B: true si procédure de séparation existe

	@Column(DataTypes.FLOAT)
	separabilityPoints?: number; // Points calculés (5, 3, 2, ou 0)

	// Critère 2: Emballage - Élément 1 Proportion de matériau recyclable
	@Column(DataTypes.FLOAT)
	packagingRecyclableMass!: number; // Masse de l'emballage en matière recyclable

	@Column(DataTypes.FLOAT)
	packagingTotalMass!: number; // Masse totale de l'emballage

	@Column(DataTypes.BOOLEAN)
	hasNationalRecyclingChannel!: boolean; // true si un canal national de recyclage existe

	@Column(DataTypes.FLOAT)
	recyclableMaterialRate?: number; // Taux calculé en pourcentage

	@Column(DataTypes.FLOAT)
	recyclableMaterialPoints?: number; // Points calculés (0, 1, 3, ou 5)

	// Critère 2: Emballage - Élément 2 Matériaux recyclés utilisés pour l'emballage
	@Column(DataTypes.FLOAT)
	packagingRecycledMass!: number; // Masse de l'emballage en matériaux recyclés

	@Column(DataTypes.FLOAT)
	packagingTotalMassForRecycled!: number; // Masse totale pour calcul de taux recyclé

	@Column(DataTypes.FLOAT)
	recycledMaterialRate?: number; // Taux calculé en pourcentage

	@Column(DataTypes.FLOAT)
	recycledMaterialPoints?: number; // Points calculés (0, 1, 3, ou 5)

	// Vulnérabilité globale
	@Column(DataTypes.FLOAT)
	wasteProductionMastery?: number; // Score final = somme des 4 éléments (max 20 points)

}
