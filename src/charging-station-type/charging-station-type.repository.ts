import { Injectable } from "@nestjs/common";
import { DatabaseService } from "../common/database.service";
import { CreateChargingStationTypeDto } from "./dto/create-charging-station-type.dto";
import { UpdateChargingStationTypeDto } from "./dto/update-charging-station-type.dto";
import { ChargingStationTypeQueryDto } from "./dto/charging-station-type.query.dto";

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

    async getChargingStationTypes(queryDto: ChargingStationTypeQueryDto) {
        const skip = (queryDto.pageNumber-1) * queryDto.pageSize;
        return this.databaseService.chargingStationType.findMany({
            where: {
                name: queryDto.name !== undefined ? { contains: queryDto.name } : undefined,
                plugCount: queryDto.plugCount !== undefined ? { equals: queryDto.plugCount } : undefined,
                currentType: queryDto.currentType !== undefined ? { equals: queryDto.currentType } : undefined
            },
            skip: skip,
            take: queryDto.pageSize
        });
    }

    async countChargingStationsWithChargingStationType(chargingStationTypeId: string) {
        return this.databaseService.chargingStation.count({
            where: { chargingStationTypeId: chargingStationTypeId }
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

    async deleteChargingStationType(id: string) {
        return this.databaseService.chargingStationType.delete({
            where: { id }
        });
    }
}