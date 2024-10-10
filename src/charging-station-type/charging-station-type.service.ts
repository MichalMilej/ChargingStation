import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/common/database.service';
import { CreateChargingStationTypeDto } from './dto/create-charging-station-type.dto';
import { UpdateChargingStationTypeDto } from './dto/update-charging-station-type.dto';
import { ChargingStationTypeRepository } from './charging-station-type.repository';

@Injectable()
export class ChargingStationTypeService {
    private readonly logger: Logger;

    constructor(
        private readonly databaseService: DatabaseService,
        private readonly chargingStationTypeRepository: ChargingStationTypeRepository) {
        this.logger = new Logger(ChargingStationTypeService.name);
    }

    async createChargingStationType(createChargingStationTypeDto: CreateChargingStationTypeDto) {
        if (await this.chargingStationTypeRepository.getChargingStationTypeByName(createChargingStationTypeDto.name) !== null) {
            const message = `ChargingStationType with name '${createChargingStationTypeDto.name}' already exists in database`;
            this.logger.log(message);
            throw new ConflictException(message);
        }
        const chargingStationType = await this.chargingStationTypeRepository.createChargingStationType(createChargingStationTypeDto);
        this.logger.log(`Created ChargingStationType with id '${chargingStationType.id}'`);
        return chargingStationType;
    }

    async getChargingStationTypeById(id: string) {
        const chargingStationType = await this.chargingStationTypeRepository.getChargingStationTypeById(id);
        if (chargingStationType !== null) {
            this.logger.log(`Returned ChargingStationType with id '${chargingStationType.id}'`);
            return chargingStationType;
        } else {
            const message = `ChargingStationType with id '${id}' not found`;
            this.logger.log(message);
            throw new NotFoundException(message);
        }
    }

    async getChargingStationTypeByName(name: string) {
        const chargingStationType = await this.chargingStationTypeRepository.getChargingStationTypeByName(name);
        if (chargingStationType !== null) {
            this.logger.log(`Returned ChargingStationType with name '${chargingStationType.name}'`);
            return chargingStationType;
        } else {
            const message = `ChargingStationType with name '${name}' not found`;
            this.logger.log(message);
            throw new NotFoundException(message);
        }
    }

    async getChargingStationTypes(pageNumber: number = 1, pageSize: number = 5) {
        const chargingStationTypes = await this.chargingStationTypeRepository.getChargingStationTypes(pageNumber, pageSize);
        const totalChargingStationTypes = await this.chargingStationTypeRepository.countTotalChargingStationTypes();
        const totalPages = Math.ceil(totalChargingStationTypes / pageSize);

        this.logger.log(`Returned list of '${chargingStationTypes.length}' ChargingStationType. PageNumber '${pageNumber}', pageSize '${pageSize}'`);
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
        if (await this.chargingStationTypeRepository.getChargingStationTypeById(id) === null) {
            const message = `ChargingStationType with id '${id}' not found`;
            this.logger.log(message);
            throw new NotFoundException(message);
        }

        const chargingStationType = await this.chargingStationTypeRepository.updateChargingStationType(id, updateChargingStationTypeDto);
        this.logger.log(`Updated ChargingStationType with id '${chargingStationType.id}'`);
        return chargingStationType;
    }

    async deleteChargingStationType(id: string) {
        
    }
}
