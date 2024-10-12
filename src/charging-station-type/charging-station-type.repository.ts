import { Injectable } from "@nestjs/common";
import { DatabaseService } from "src/common/database.service";
import { CreateChargingStationTypeDto } from "./dto/create-charging-station-type.dto";
import { UpdateChargingStationTypeDto } from "./dto/update-charging-station-type.dto";
import { ChargingStationTypeFilterDto } from "./dto/charging-station-type.filter.dto";

@Injectable()
export class ChargingStationTypeRepository {

    constructor(private readonly databaseService: DatabaseService) {}

    async createChargingStationType(createChargingStationTypeDto: CreateChargingStationTypeDto) {
        return this.databaseService.chargingStationType.create({
            data: createChargingStationTypeDto
        });
    }

    async getChargingStationTypeById(id: string) {
        return this.databaseService.chargingStationType.findUnique({
            where: { id }
        });
    }

    async getChargingStationTypeByName(name: string) {
        return this.databaseService.chargingStationType.findUnique({
            where: { name }
        });
    }

    async getChargingStationTypes(pageNumber: number = 1, pageSize: number = 5, filterDto: ChargingStationTypeFilterDto) {
        const skip = (pageNumber-1) * pageSize;
        return this.databaseService.chargingStationType.findMany({
            where: {
                name: filterDto.name ? { contains: filterDto.name } : undefined,
                plugCount: filterDto.plugCount ? { equals: filterDto.plugCount } : undefined,
                currentType: filterDto.currentType ? { equals: filterDto.currentType } : undefined
            },
            skip: skip,
            take: pageSize
        });
    }

    async countTotalChargingStationTypes() {
        return this.databaseService.chargingStationType.count();
    }

    async updateChargingStationType(id: string, updateChargingStationTypeDto: UpdateChargingStationTypeDto) {
        return this.databaseService.chargingStationType.update({
            where: { id },
            data: updateChargingStationTypeDto
        });
    }
}