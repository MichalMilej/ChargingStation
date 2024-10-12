import { Injectable } from "@nestjs/common";
import { DatabaseService } from "src/common/database.service";
import { CreateConnectorDto } from "./dto/create-connector.dto";
import { ConnectorQueryDto } from "./dto/connector.query.dto";

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

    async countTotalConnectors() {
        return this.databaseService.connector.count();
    }
}