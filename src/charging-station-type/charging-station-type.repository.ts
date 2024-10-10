import { Injectable } from "@nestjs/common";
import { DatabaseService } from "src/common/database.service";
import { CreateChargingStationTypeDto } from "./dto/create-charging-station-type.dto";
import { UpdateChargingStationTypeDto } from "./dto/update-charging-station-type.dto";

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

    async getChargingStationTypes(pageNumber: number = 1, pageSize: number = 5) {
        const skip = (pageNumber-1) * pageSize;
        return this.databaseService.chargingStationType.findMany({
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