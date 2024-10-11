import { Injectable } from "@nestjs/common";
import { DatabaseService } from "src/common/database.service";
import { CreateConnectorDto } from "./dto/create-connector.dto";

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

    async getConnectors(pageNumber: number = 1, pageSize: number = 5) {
        const skip = (pageNumber-1) * pageSize;
        return this.databaseService.connector.findMany({
            skip: skip,
            take: pageSize
        });
    }

    async countTotalConnectors() {
        return this.databaseService.connector.count();
    }
}