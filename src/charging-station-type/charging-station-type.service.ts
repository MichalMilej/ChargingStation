import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from 'src/common/database.service';
import { CreateChargingStationTypeDto } from './dto/create-charging-station-type.dto';
import { UpdateChargingStationTypeDto } from './dto/update-charging-station-type.dto';
import { ChargingStationTypeRepository } from './charging-station-type.repository';
import { CommonException } from 'src/common/common.exception';
import { CommonPagination, Pagination } from 'src/common/common.pagination';
import { ChargingStationTypeQueryDto } from './dto/charging-station-type.query.dto';

@Injectable()
export class ChargingStationTypeService {
    private readonly logger: Logger;

    constructor(
        private readonly databaseService: DatabaseService,
        private readonly chargingStationTypeRepository: ChargingStationTypeRepository) {
        this.logger = new Logger(ChargingStationTypeService.name);
    }

    async createChargingStationType(createChargingStationTypeDto: CreateChargingStationTypeDto) {
        await this.validateNameConflict(createChargingStationTypeDto.name);
        const chargingStationType = await this.chargingStationTypeRepository.createChargingStationType(createChargingStationTypeDto);
        this.logger.log(`Created ChargingStationType with id '${chargingStationType.id}'`);
        return chargingStationType;
    }

    async getChargingStationTypeById(id: string) {
        const chargingStationType = await this.chargingStationTypeRepository.getChargingStationTypeById(id);
        if (chargingStationType === null) {
            CommonException.notFoundException(this.logger, 'ChargingStationType', 'id', id);
        }
        this.logger.log(`Returned ChargingStationType with id '${id}'`);
        return chargingStationType;
    }

    async getChargingStationTypeByName(name: string) {
        const chargingStationType = await this.chargingStationTypeRepository.getChargingStationTypeByName(name);
        if (chargingStationType === null) {
            CommonException.notFoundException(this.logger, 'ChargingStationType', 'name', name);
        }
        this.logger.log(`Returned ChargingStationType with name '${name}'`);
        return chargingStationType;
    }

    async getChargingStationTypes(chargingStationTypeQueryDto: ChargingStationTypeQueryDto) {
        const chargingStationTypes = await this.chargingStationTypeRepository.getChargingStationTypes(chargingStationTypeQueryDto);
        const totalChargingStationTypes = await this.chargingStationTypeRepository.countTotalChargingStationTypes();

        this.logger.log(`Returned list of '${chargingStationTypes.length}' ChargingStationType`);
        return CommonPagination.paginate(chargingStationTypes, new Pagination(chargingStationTypeQueryDto, totalChargingStationTypes));
    }

    async updateChargingStationType(id: string, updateChargingStationTypeDto: UpdateChargingStationTypeDto) {
        if (await this.chargingStationTypeRepository.getChargingStationTypeById(id) === null) {
            CommonException.notFoundException(this.logger, 'ChargingStationType', 'id', id);
        }
        if (updateChargingStationTypeDto.name !== undefined) {
            await this.validateNameConflict(updateChargingStationTypeDto.name);
        }
        const chargingStationType = await this.chargingStationTypeRepository.updateChargingStationType(id, updateChargingStationTypeDto);
        this.logger.log(`Updated ChargingStationType with id '${chargingStationType.id}'`);
        return chargingStationType;
    }

    async deleteChargingStationType(id: string) {
        
    }

    private async validateNameConflict(name: string) {
        if (await this.chargingStationTypeRepository.getChargingStationTypeByName(name) !== null) {
            CommonException.alreadyInDatabaseException(this.logger, 'ChargingStationType', 'name', name);
        }
    }
}
