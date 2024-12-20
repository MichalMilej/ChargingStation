import { Injectable, Logger } from '@nestjs/common';
import { CreateChargingStationTypeDto } from './dto/create-charging-station-type.dto';
import { UpdateChargingStationTypeDto } from './dto/update-charging-station-type.dto';
import { ChargingStationTypeRepository } from './charging-station-type.repository';
import { CommonException } from '../common/common.exception';
import { CommonPagination, Pagination } from '../common/common.pagination';
import { ChargingStationTypeQueryDto } from './dto/charging-station-type.query.dto';

@Injectable()
export class ChargingStationTypeService {
    private readonly logger: Logger;

    constructor(private readonly chargingStationTypeRepository: ChargingStationTypeRepository) {
        this.logger = new Logger(ChargingStationTypeService.name);
    }

    async createChargingStationType(createChargingStationTypeDto: CreateChargingStationTypeDto) {
        await this.validateNameConflict(createChargingStationTypeDto.name);
        const chargingStationType = await this.chargingStationTypeRepository.createChargingStationType(createChargingStationTypeDto);
        this.logger.log(`Created ChargingStationType with id '${chargingStationType.id}'`);
        return chargingStationType;
    }

    async getChargingStationTypeById(id: string) {
        const chargingStationType = await this.retrieveChargingStationTypeById(id);
        this.logger.log(`Returned ChargingStationType with id '${id}'`);
        return chargingStationType;
    }

    async getChargingStationTypeByName(name: string) {
        const chargingStationType = await this.chargingStationTypeRepository.getChargingStationTypeByName(name);
        if (chargingStationType === null) {
            throw CommonException.notFoundException(this.logger, 'ChargingStationType', 'name', name);
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
        await this.retrieveChargingStationTypeById(id);
        if (updateChargingStationTypeDto.name !== undefined) {
            await this.validateNameConflict(updateChargingStationTypeDto.name);
        }
        if (updateChargingStationTypeDto.plugCount !== undefined) {
            await this.validateChargingStationsNotBound(id);
        }
        const chargingStationType = await this.chargingStationTypeRepository.updateChargingStationType(id, updateChargingStationTypeDto);
        this.logger.log(`Updated ChargingStationType with id '${chargingStationType.id}'`);
        return chargingStationType;
    }

    async deleteChargingStationType(id: string) {
        await this.retrieveChargingStationTypeById(id);
        await this.validateChargingStationsNotBound(id);
        await this.chargingStationTypeRepository.deleteChargingStationType(id);
        this.logger.log(`Deleted ChargingStationType with id '${id}'`);
    }

    private async retrieveChargingStationTypeById(id: string) {
        const chargingStationType = await this.chargingStationTypeRepository.getChargingStationTypeById(id);
        if (chargingStationType === null) {
            throw CommonException.notFoundException(this.logger, 'ChargingStationType', 'id', id);
        }
        return chargingStationType;
    }

    private async validateNameConflict(name: string) {
        if (await this.chargingStationTypeRepository.getChargingStationTypeByName(name) !== null) {
            throw CommonException.alreadyInDatabaseException(this.logger, 'ChargingStationType', 'name', name);
        }
    }

    private async validateChargingStationsNotBound(chargingStationTypeId: string) {
        if (await this.chargingStationTypeRepository.countChargingStationsWithChargingStationType(chargingStationTypeId) > 0) {
            throw CommonException.conflictException(this.logger, `ChargingStationType is bound to ChargingStation instances`);
        }
    }
}
