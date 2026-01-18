import { Inject, Service } from "typedi";
import { server } from "../../Server";
import V6InclusionAndDiversityDto from "../dto/V6InclusionAndDiversityDto";
import V6InclusionAndDiversityDao from "../dao/V6InclusionAndDiversityDao";
import V6InclusionAndDiversity from "../entities/V6InclusionAndDiversity";
import IndexDMDurableDao from "../dao/IndexDMDurableDao";
import IndexDMDurable from "../entities/IndexDMDurable";

@Service()
export default class V6InclusionAndDiversityService {
	@Inject(() => V6InclusionAndDiversityDao)
	v6InclusionAndDiversityDao!: V6InclusionAndDiversityDao

	@Inject(() => IndexDMDurableDao)
	indexDMDurableDao!: IndexDMDurableDao

	save = async (dto: V6InclusionAndDiversityDto, idIndexDmDurable: bigint | undefined) => {
		return await server.sequelize.transaction(async t => {
			try {
				if (!idIndexDmDurable) {
					throw new Error('No indexDmDurable provided')
				}

				// Validate input
				this.validateInput(dto);

				const indexDmDurable: IndexDMDurable | null = await this.indexDMDurableDao.findById(idIndexDmDurable)
				if (!indexDmDurable) {
					throw new Error('IndexDmDurable not found')
				}

				// Calculate individual criteria points
				const youngEmploymentPoints = this.calculateYoungEmploymentPoints(dto.youngEmploymentPercentage);
				const seniorEmploymentPoints = this.calculateSeniorEmploymentPoints(dto.seniorEmploymentPercentage);
				const womenManagementPoints = this.calculateWomenManagementPoints(dto.womenManagementPercentage);
				const salarialEquityPoints = this.calculateSalarialEquityPoints(dto.menAverageHourlyWage, dto.womenAverageHourlyWage);
				const accessibilityInclusionPoints = this.calculateAccessibilityAndInclusionPoints(dto.disabledEmployeesCount, dto.totalEmployeesCount);
				const antidiscriminationPoints = this.calculateAntidiscriminationPoints(dto.discriminationOrganizationInPlace, dto.followUpAlerts);

				// Calculate vulnerability
				const vulnerability = this.calculateVulnerabilityV6({
					youngEmploymentPoints,
					seniorEmploymentPoints,
					womenManagementPoints,
					salarialEquityPoints,
					accessibilityInclusionPoints,
					antidiscriminationPoints
				});

				let v6InclusionAndDiversity: V6InclusionAndDiversity | null;

				// Check if entity already exists for this indexDMDurableId
				const existingEntity = await this.v6InclusionAndDiversityDao.findOne({ indexDMDurableId: idIndexDmDurable });

				if (existingEntity) {
					// Update existing entity
					await existingEntity.update({
						indexDMDurableId: indexDmDurable.id,
						youngEmploymentPercentage: dto.youngEmploymentPercentage,
						seniorEmploymentPercentage: dto.seniorEmploymentPercentage,
						womenManagementPercentage: dto.womenManagementPercentage,
						menAverageHourlyWage: dto.menAverageHourlyWage,
						womenAverageHourlyWage: dto.womenAverageHourlyWage,
						disabledEmployeesCount: dto.disabledEmployeesCount,
						totalEmployeesCount: dto.totalEmployeesCount,
						discriminationOrganizationInPlace: dto.discriminationOrganizationInPlace,
						followUpAlerts: dto.followUpAlerts,
						youngEmploymentPoints,
						seniorEmploymentPoints,
						womenManagementPoints,
						salarialEquityPoints,
						accessibilityInclusionPoints,
						antidiscriminationPoints,
						vulnerability
					}, { transaction: t })
					v6InclusionAndDiversity = existingEntity;
				} else {
					// Create new entity
					v6InclusionAndDiversity = V6InclusionAndDiversity.build({
						indexDMDurableId: indexDmDurable.id,
						youngEmploymentPercentage: dto.youngEmploymentPercentage,
						seniorEmploymentPercentage: dto.seniorEmploymentPercentage,
						womenManagementPercentage: dto.womenManagementPercentage,
						menAverageHourlyWage: dto.menAverageHourlyWage,
						womenAverageHourlyWage: dto.womenAverageHourlyWage,
						disabledEmployeesCount: dto.disabledEmployeesCount,
						totalEmployeesCount: dto.totalEmployeesCount,
						discriminationOrganizationInPlace: dto.discriminationOrganizationInPlace,
						followUpAlerts: dto.followUpAlerts,
						youngEmploymentPoints,
						seniorEmploymentPoints,
						womenManagementPoints,
						salarialEquityPoints,
						accessibilityInclusionPoints,
						antidiscriminationPoints,
						vulnerability
					})
					await v6InclusionAndDiversity.save({ transaction: t })
				}

				return v6InclusionAndDiversity;
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
			const entity = await this.v6InclusionAndDiversityDao.findOne({ indexDMDurableId: indexDMDurableId })
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
			const entity = await this.v6InclusionAndDiversityDao.findById(id)
			if (entity) {
				const v6Data = entity.dataValues
				if (v6Data.vulnerability !== undefined) {
					return Math.round(v6Data.vulnerability * 100) / 100;
				} else {
					throw new Error('No vulnerability calculated')
				}
			} else {
				throw new Error('No V6 entity found')
			}
		} catch (err) {
			console.log(err)
			throw err;
		}
	}

	/**
	 * Calculate points for young employment percentage (< 30 years)
	 * 0-10% → 1 point
	 * 10-20% → 3 points
	 * 20%+ → 5 points
	 */
	private calculateYoungEmploymentPoints = (percentage: number): number => {
		if (percentage >= 0 && percentage < 10) {
			return 1;
		} else if (percentage >= 10 && percentage < 20) {
			return 3;
		} else if (percentage >= 20 && percentage <= 100) {
			return 5;
		}
		return 0;
	}

	/**
	 * Calculate points for senior employment percentage (> 50 years)
	 * 0-10% → 1 point
	 * 10-20% → 3 points
	 * 20%+ → 5 points
	 */
	private calculateSeniorEmploymentPoints = (percentage: number): number => {
		if (percentage >= 0 && percentage < 10) {
			return 1;
		} else if (percentage >= 10 && percentage < 20) {
			return 3;
		} else if (percentage >= 20 && percentage <= 100) {
			return 5;
		}
		return 0;
	}

	/**
	 * Calculate points for women in senior management
	 * 0-30% → 2 points
	 * 30-50% → 6 points
	 * 50%+ → 10 points
	 */
	private calculateWomenManagementPoints = (percentage: number): number => {
		if (percentage >= 0 && percentage < 30) {
			return 2;
		} else if (percentage >= 30 && percentage < 50) {
			return 6;
		} else if (percentage >= 50 && percentage <= 100) {
			return 10;
		}
		return 0;
	}

	/**
	 * Calculate points for salarial equity
	 * Gap = (MenAvgWage - WomenAvgWage) / MenAvgWage × 100
	 * 0-1% → 20 points
	 * 1-5% → 12 points
	 * 5-10% → 4 points
	 * 10%+ → 0 points
	 */
	private calculateSalarialEquityPoints = (menWage: number, womenWage: number): number => {
		// Handle edge cases
		if (menWage === 0 || menWage === undefined) {
			throw new Error('Men average hourly wage must be greater than 0');
		}

		// Calculate gap percentage
		const gap = ((menWage - womenWage) / menWage) * 100;

		if (gap >= 0 && gap <= 1) {
			return 20;
		} else if (gap > 1 && gap <= 5) {
			return 12;
		} else if (gap > 5 && gap <= 10) {
			return 4;
		} else if (gap > 10) {
			return 0;
		}
		return 0;
	}

	/**
	 * Calculate points for accessibility and inclusion (disabled employees)
	 * Ratio = (disabledCount / totalCount) × 100
	 * 0-3% → 4 points
	 * 3-9% → 12 points
	 * 9%+ → 20 points
	 */
	private calculateAccessibilityAndInclusionPoints = (disabledCount: number, totalCount: number): number => {
		// Handle edge cases
		if (totalCount === 0 || totalCount === undefined) {
			throw new Error('Total employees count must be greater than 0');
		}

		// Calculate disability representation percentage
		const ratio = (disabledCount / totalCount) * 100;

		if (ratio >= 0 && ratio < 3) {
			return 4;
		} else if (ratio >= 3 && ratio < 9) {
			return 12;
		} else if (ratio >= 9 && ratio <= 100) {
			return 20;
		}
		return 0;
	}

	/**
	 * Calculate points for anti-discrimination measures
	 * If discriminationOrganizationInPlace = false → 0 points
	 * If discriminationOrganizationInPlace = true:
	 *   - If followUpAlerts = false → 12 points
	 *   - If followUpAlerts = true → 20 points
	 */
	private calculateAntidiscriminationPoints = (organizationInPlace: boolean, followUpAlerts?: boolean | null): number => {
		if (!organizationInPlace) {
			return 0;
		}

		if (followUpAlerts === true) {
			return 20;
		} else {
			return 12;
		}
	}

	/**
	 * Calculate Criterion 1: Demographic Composition (out of 20)
	 * Score = youngEmploymentPoints + seniorEmploymentPoints + womenManagementPoints
	 */
	private calculateDemographicCompositionCriteria = (
		youngPoints: number,
		seniorPoints: number,
		womenPoints: number
	): number => {
		return youngPoints + seniorPoints + womenPoints;
	}

	/**
	 * Calculate final vulnerability score for V6
	 * Sous-total = Critère 1 + Critère 2 + Critère 3 + Critère 4 (maximum 80 points)
	 * Vulnérabilité = Sous-total × 0.25
	 */
	private calculateVulnerabilityV6 = (data: {
		youngEmploymentPoints: number,
		seniorEmploymentPoints: number,
		womenManagementPoints: number,
		salarialEquityPoints: number,
		accessibilityInclusionPoints: number,
		antidiscriminationPoints: number
	}): number => {
		// Criterion 1: Demographic Composition (max 20)
		const criterion1 = data.youngEmploymentPoints + data.seniorEmploymentPoints + data.womenManagementPoints;

		// Criterion 2: Salarial Equity (max 20)
		const criterion2 = data.salarialEquityPoints;

		// Criterion 3: Accessibility and Inclusion (max 20)
		const criterion3 = data.accessibilityInclusionPoints;

		// Criterion 4: Anti-discrimination (max 20)
		const criterion4 = data.antidiscriminationPoints;

		// Total (max 80)
		const subtotal = criterion1 + criterion2 + criterion3 + criterion4;

		// Calculate vulnerability out of 20
		const vulnerability = (subtotal * 0.25);

		// Return rounded to 2 decimal places
		return Math.round(vulnerability * 100) / 100;
	}

	/**
	 * Validate input data according to specifications
	 */
	private validateInput = (dto: V6InclusionAndDiversityDto) => {
		// Validate percentages are between 0 and 100
		if (dto.youngEmploymentPercentage < 0 || dto.youngEmploymentPercentage > 100) {
			throw new Error('youngEmploymentPercentage must be between 0 and 100');
		}

		if (dto.seniorEmploymentPercentage < 0 || dto.seniorEmploymentPercentage > 100) {
			throw new Error('seniorEmploymentPercentage must be between 0 and 100');
		}

		if (dto.womenManagementPercentage < 0 || dto.womenManagementPercentage > 100) {
			throw new Error('womenManagementPercentage must be between 0 and 100');
		}

		// Validate wages are >= 0
		if (dto.menAverageHourlyWage < 0) {
			throw new Error('menAverageHourlyWage must be >= 0');
		}

		if (dto.womenAverageHourlyWage < 0) {
			throw new Error('womenAverageHourlyWage must be >= 0');
		}

		if (dto.menAverageHourlyWage === 0) {
			throw new Error('menAverageHourlyWage must be greater than 0');
		}

		// Validate employee counts are >= 0
		if (dto.disabledEmployeesCount < 0) {
			throw new Error('disabledEmployeesCount must be >= 0');
		}

		if (dto.totalEmployeesCount < 0) {
			throw new Error('totalEmployeesCount must be >= 0');
		}

		if (dto.totalEmployeesCount === 0) {
			throw new Error('totalEmployeesCount must be greater than 0');
		}

		// Validate discrimination organization is boolean
		if (typeof dto.discriminationOrganizationInPlace !== 'boolean') {
			throw new Error('discriminationOrganizationInPlace must be boolean');
		}

		// If discriminationOrganizationInPlace is false, followUpAlerts can be null
		// If discriminationOrganizationInPlace is true, followUpAlerts should be provided
		if (dto.discriminationOrganizationInPlace === true && (dto.followUpAlerts === undefined || dto.followUpAlerts === null)) {
			throw new Error('followUpAlerts must be provided when discriminationOrganizationInPlace is true');
		}

		// Validate disabled employees <= total employees
		if (dto.disabledEmployeesCount > dto.totalEmployeesCount) {
			throw new Error('disabledEmployeesCount cannot be greater than totalEmployeesCount');
		}
	}
}
