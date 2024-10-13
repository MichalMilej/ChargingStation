import { Injectable } from "@nestjs/common";
import { DatabaseService } from "src/common/database.service";
import { CreateChargingStationDto } from "./dto/create-charging-station.dto";
import { UpdateChargingStationDto } from "./dto/update-charging-station.dto";
import { ChargingStationQueryDto } from "./dto/charging-station.query.dto";

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

    async getChargingStations(queryDto: ChargingStationQueryDto) {
        const skip = (queryDto.pageNumber-1) * queryDto.pageSize;
        return this.databaseService.chargingStation.findMany({
            where: {
                name: queryDto.name !== undefined ? { contains: queryDto.name } : undefined,
                ipAddress: queryDto.ipAddress !== undefined ? { contains: queryDto.ipAddress } : undefined,
                firmwareVersion: queryDto.firmwareVersion !== undefined ? { startsWith: queryDto.firmwareVersion } : undefined,
                chargingStationTypeId: queryDto.chargingStationTypeId !== undefined ? { equals: queryDto.chargingStationTypeId } : undefined
            },
            skip: skip,
            take: queryDto.pageSize
        });
    }

    async updateChargingStation(id: string, updateChargingStationDto: UpdateChargingStationDto) {
        return this.databaseService.chargingStation.update({
            where: { id },
            data: updateChargingStationDto
        })
    }

    async countTotalChargingStations() {
        return this.databaseService.chargingStation.count();
    }
}