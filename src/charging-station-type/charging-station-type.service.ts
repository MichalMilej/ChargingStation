import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/common/database.service';
import { CreateChargingStationTypeDto } from './dto/create-charging-station-type.dto';
import { UpdateChargingStationTypeDto } from './dto/update-charging-station-type.dto';
import { ChargingStationTypeRepository } from './charging-station-type.repository';
import { CommonException } from 'src/common/common.exception';

@Injectable()
export class ChargingStationTypeService {
    private readonly logger: Logger;

    constructor(
        private readonly databaseService: DatabaseService,
        private readonly chargingStationTypeRepository: ChargingStationTypeRepository) {
        this.logger = new Logger(ChargingStationTypeService.name);
    }

    async createChargingStationType(createChargingStationTypeDto: CreateChargingStationTypeDto) {
        const name = createChargingStationTypeDto.name;
        if (await this.chargingStationTypeRepository.getChargingStationTypeByName(name) !== null) {
            CommonException.conflictException(this.logger, 'ChargingStationType', 'name', name);
        }
        const chargingStationType = await this.chargingStationTypeRepository.createChargingStationType(createChargingStationTypeDto);
        this.logger.log(`Created ChargingStationType with id '${chargingStationType.id}'`);
        return chargingStationType;
    }

    async getChargingStationTypeById(id: string) {
        const chargingStationType = await this.chargingStationTypeRepository.getChargingStationTypeById(id);
        if (chargingStationType !== null) {
            this.logger.log(`Returned ChargingStationType with id '${id}'`);
            return chargingStationType;
        } else {
            CommonException.notFoundException(this.logger, 'ChargingStationType', 'id', id);
        }
    }

    async getChargingStationTypeByName(name: string) {
        const chargingStationType = await this.chargingStationTypeRepository.getChargingStationTypeByName(name);
        if (chargingStationType !== null) {
            this.logger.log(`Returned ChargingStationType with name '${chargingStationType.name}'`);
            return chargingStationType;
        } else {
            CommonException.notFoundException(this.logger, 'ChargingStationType', 'name', name);
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
            CommonException.notFoundException(this.logger, 'ChargingStationType', 'id', id);
        }
        const chargingStationType = await this.chargingStationTypeRepository.updateChargingStationType(id, updateChargingStationTypeDto);
        this.logger.log(`Updated ChargingStationType with id '${chargingStationType.id}'`);
        return chargingStationType;
    }

    async deleteChargingStationType(id: string) {
        
    }
}
