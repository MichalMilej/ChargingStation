import { Injectable } from "@nestjs/common";
import { DatabaseService } from "../common/database.service";
import { CreateChargingStationDto } from "./dto/create-charging-station.dto";
import { UpdateChargingStationDto } from "./dto/update-charging-station.dto";
import { ChargingStationQueryDto } from "./dto/charging-station.query.dto";
import { ReplaceConnectorDto } from "./dto/replace-connector.dto";

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
        if (updateChargingStationDto.chargingStationTypeId === undefined) {
            return this.databaseService.chargingStation.update({
                where: { id },
                data: updateChargingStationDto
            });
        }
        return await this.databaseService.$transaction(async (databaseService) => {
            await databaseService.connector.updateMany({
                where: { chargingStationId: id },
                data: { chargingStationId: null }
            });
            const {connectorIds, ...preparedUpdateChargingStationDto} = updateChargingStationDto;
            const updatedChargingStation = await databaseService.chargingStation.update({
                where: { id: id },
                data: preparedUpdateChargingStationDto
            })
            for (const connectorId of connectorIds) {
                await databaseService.connector.update({
                    where: {
                        id: connectorId
                    },
                    data: {
                        chargingStationId: id
                    }
                })
            }
            return updatedChargingStation;
        });
    }

    async replaceConnector(chargingStationId: string, connectorId: string, replaceConnectorDto: ReplaceConnectorDto) {
        return this.databaseService.$transaction(async (databaseService) => {
            const oldConnector = await databaseService.connector.update({
                where: { id: connectorId },
                data: { chargingStationId: null }
            });
            const newConnector = await databaseService.connector.update({
                where: { id: replaceConnectorDto.newConnectorId },
                data: { chargingStationId: chargingStationId }
            });
            return { oldConnector, newConnector };
        });
    }

    async deleteChargingStation(id: string) {
        await this.databaseService.$transaction(async (databaseService) => {
            await databaseService.connector.updateMany({
                where: { chargingStationId: id },
                data: { chargingStationId: null }
            })
            await databaseService.chargingStation.delete({
                where: { id }
            })
        })
    }

    async countTotalChargingStations() {
        return this.databaseService.chargingStation.count();
    }
}