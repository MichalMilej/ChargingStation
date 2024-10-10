import { Injectable } from "@nestjs/common";
import { DatabaseService } from "src/common/database.service";
import { CreateChargingStationDto } from "./dto/create-charging-station.dto";

@Injectable()
export class ChargingStationRepository {
    constructor(private databaseService: DatabaseService) {}

    async getChargingStationByDeviceId(deviceId: string) {
        return this.databaseService.chargingStation.findUnique({
            where: { deviceId }
        });
    }

    async getChargingStationById(id: string) {
        return this.databaseService.chargingStation.findUnique({
            where: { id }
        });
    }

    async getChargingStationByName(name: string) {
        return this.databaseService.chargingStation.findUnique({
            where: { name }
        });
    }

    async createChargingStation(createChargingStationDto: CreateChargingStationDto) {
        return this.databaseService.chargingStation.create({
            data: createChargingStationDto
        });
    }
}