import { Injectable } from "@nestjs/common";
import { CreateConnectorDto } from "./dto/create-connector.dto";
import { ConnectorQueryDto } from "./dto/connector.query.dto";
import { UpdateConnectorDto } from "./dto/update-connector.dto";
import { DatabaseService } from "../common/database.service";

@Injectable()
export class ConnectorRepository {

    constructor(private readonly databaseService: DatabaseService) {}

    async createConnector(createConnectorDto: CreateConnectorDto) {
        return this.databaseService.connector.create({
            data: createConnectorDto
        });
    }

    async getConnectorById(id: string) {
        return this.databaseService.connector.findUnique({
            where: { id }
        })
    }

    async getConnectors(queryDto: ConnectorQueryDto) {
        const skip = (queryDto.pageNumber-1) * queryDto.pageSize;
        return this.databaseService.connector.findMany({
            where: {
                name: queryDto.name !== undefined ? { contains: queryDto.name } : undefined,
                priority: queryDto.priority !== undefined ? { equals: queryDto.priority } : undefined,
                chargingStationId: queryDto.chargingStationId !== undefined ? { equals: queryDto.chargingStationId } : undefined
            },
            skip: skip,
            take: queryDto.pageSize
        });
    }

    async getConnectorsByChargingStationId(chargingStationId: string) {
        return this.databaseService.connector.findMany({
            where: { chargingStationId: chargingStationId }
        });
    }

    async countTotalConnectors() {
        return this.databaseService.connector.count();
    }

    async updateConnector(id: string, updateConnectorDto: UpdateConnectorDto) {
        return this.databaseService.connector.update({
            where: { id },
            data: updateConnectorDto
        });
    }

    async deleteConnector(id: string) {
        this.databaseService.connector.delete({
            where: { id }
        });
    }
}