export default class V2WaterConsumptionDto {
	id?: bigint;
	noWaterNeed!: boolean;
	waterMadeQuantity!: number;
	waterConsommationQuantity!: number;
	totalReusedWater?: number | null;
	totalConsumedWater?: number | null;
}
