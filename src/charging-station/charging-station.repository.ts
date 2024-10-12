import { Injectable } from "@nestjs/common";
import { DatabaseService } from "src/common/database.service";
import { CreateChargingStationDto } from "./dto/create-charging-station.dto";
import { UpdateChargingStationDto } from "./dto/update-charging-station.dto";

@Injectable()
export class ChargingStationRepository {
    constructor(private databaseService: DatabaseService) {}

    async createChargingStation(createChargingStationDto: CreateChargingStationDto) {
        const {connectorIds, ...preparedCreateChargingStationDto} = createChargingStationDto;
        return await this.databaseService.$transaction(async (databaseService) => {
            const newChargingStation = await databaseService.chargingStation.create({
                data: preparedCreateChargingStationDto
            })
            for (const connectorId of connectorIds) {
                await databaseService.connector.update({
                    where: {
                        id: connectorId
                    },
                    data: {
                        chargingStationId: newChargingStation.id
                    }
                })
            }
            return newChargingStation;
        });
    }

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

    async getChargingStations(pageNumber: number = 1, pageSize: number = 5) {
        const skip = (pageNumber-1) * pageSize;
        return this.databaseService.chargingStation.findMany({
            skip: skip,
            take: pageSize
        });
    }

    async updateChargingStation(id: string, updateChargingStationDto: UpdateChargingStationDto) {
        return this.databaseService.chargingStation.update({
            data: updateChargingStationDto,
            where: {id}
        })
    }

    async countTotalChargingStations() {
        return this.databaseService.chargingStation.count();
    }
}