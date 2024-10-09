import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/common/database.service';
import { CreateChargingStationTypeDto } from './dto/create-ch-station-type.dto';
import { UpdateChargingStationTypeDto } from './dto/update-ch-station-type.dto';

@Injectable()
export class ChargingStationTypeService {
    logger: Logger;

    constructor(private readonly databaseService: DatabaseService) {
        this.logger = new Logger(ChargingStationTypeService.name);
    }

    async createChargingStationType(createChargingStationTypeDto: CreateChargingStationTypeDto) {
        if (await this.databaseService.chargingStationType.findUnique({
            where: {
                name: createChargingStationTypeDto.name
            }
        }) !== null) {
            const message = `Charging station type with name '${createChargingStationTypeDto.name}' already exists in database`;
            this.logger.log(message);
            throw new ConflictException(message);
        }

        const chargingStationType = await this.databaseService.chargingStationType.create({
            data: createChargingStationTypeDto
        });
        this.logger.log(`Created charging station type with id '${chargingStationType.id}'`);
        return chargingStationType;
    }

    async getChargingStationTypeById(id: string) {
        const chargingStationType = await this.databaseService.chargingStationType.findUnique({
            where: { id }
        });
        if (chargingStationType !== null) {
            this.logger.log(`Returned charging station type with id '${chargingStationType.id}'`);
            return chargingStationType;
        } else {
            this.chargingStationTypeNotFound('id', id);
        }
    }

    async getChargingStationTypeByName(name: string) {
        const chargingStationType = await this.databaseService.chargingStationType.findUnique({
            where: { name }
        });
        if (chargingStationType !== null) {
            this.logger.log(`Returned charging station type with name '${chargingStationType.name}'`);
            return chargingStationType;
        } else {
            this.chargingStationTypeNotFound('name', name);
        }
    }

    async getChargingStationTypes(pageNumber: number = 1, pageSize: number = 5) {
        const skip = (pageNumber-1) * pageSize;
        const chargingStationTypes = await this.databaseService.chargingStationType.findMany({
            skip: skip,
            take: pageSize
        });
        const totalChargingStationTypes = await this.databaseService.chargingStationType.count();
        const totalPages = Math.ceil(totalChargingStationTypes / pageSize);

        this.logger.log(`Returned '${chargingStationTypes.length}' charging station types - pageNumber '${pageNumber}', pageSize '${pageSize}'`);
        return {
            chargingStationTypes: chargingStationTypes,
            pagination: {
                pageNumber: pageNumber,
                pageSize: pageSize,
                totalPages: totalPages,
                totalChargingStationTypes: totalChargingStationTypes
            }
        }
    }

    async updateChargingStationType(id: string, updateChargingStationTypeDto: UpdateChargingStationTypeDto) {
        if (await this.isChargingStationTypeWithIdInDatabase(id) === false) {
            this.chargingStationTypeNotFound('id', id);
        }

        const chargingStationType = await this.databaseService.chargingStationType.update({
            where: { id },
            data: updateChargingStationTypeDto
        });
        this.logger.log(`Updated charging station type with id '${chargingStationType.id}'`);
        return chargingStationType;
    }

    async deleteChargingStationType(id: string) {
        
    }

    private async isChargingStationTypeWithIdInDatabase(id: string) {
        return this.databaseService.chargingStationType.findUnique({
            where: { id }
        }) !== null;
    }

    private chargingStationTypeNotFound(paramName: string, paramValue: string) {
        const message = `Charging station type with ${paramName} '${paramValue}' not found`;
        this.logger.log(message);
        throw new NotFoundException(message);
    }
}
