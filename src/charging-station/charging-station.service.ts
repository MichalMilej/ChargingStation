import { Injectable, Logger } from '@nestjs/common';
import { CreateChargingStationDto } from './dto/create-charging-station.dto';
import { ChargingStationRepository } from './charging-station.repository';
import { ChargingStationTypeRepository } from 'src/charging-station-type/charging-station-type.repository';
import { CommonException } from 'src/common/common.exception';
import { CommonPagination, Pagination } from 'src/common/common.pagination';
import { UpdateChargingStationDto } from './dto/update-charging-station.dto';

@Injectable()
export class ChargingStationService {
    private readonly logger: Logger;

    constructor(
        private readonly chargingStationRepository: ChargingStationRepository, 
        private readonly chargingStationTypeRepository: ChargingStationTypeRepository
    ) {
        this.logger = new Logger(ChargingStationService.name);
    }

    async createChargingStation(createChargingStationDto: CreateChargingStationDto) {
        const name = createChargingStationDto.name;
        if (await this.chargingStationRepository.getChargingStationByName(name) !== null) {
            CommonException.conflictException(this.logger, 'ChargingStation', 'name', name);
        }
        const deviceId = createChargingStationDto.deviceId;
        if (await this.chargingStationRepository.getChargingStationByDeviceId(deviceId) !== null) {
            CommonException.conflictException(this.logger, "ChargingStation", 'deviceId', deviceId);
        }
        const chargingStationTypeId = createChargingStationDto.chargingStationTypeId;
        if (await this.chargingStationTypeRepository.getChargingStationTypeById(chargingStationTypeId) === null) {
            CommonException.notFoundException(this.logger, 'ChargingStationType', 'chargingStationTypeId', chargingStationTypeId);
        }
        const newChargingStation = await this.chargingStationRepository.createChargingStation(createChargingStationDto);
        this.logger.log(`Created ChargingStation with id '${newChargingStation.id}'`);
        return newChargingStation;
    }

    async getChargingStationById(id: string) {
        const chargingStation = await this.chargingStationRepository.getChargingStationById(id);
        if (chargingStation === null) {
            CommonException.notFoundException(this.logger, 'ChargingStation', 'id', id);
        }
        this.logger.log(`Returned ChargingStation with id '${id}'`);
        return chargingStation;
    }

    async getChargingStationByName(name: string) {
        const chargingStation = await this.chargingStationRepository.getChargingStationByName(name);
        if (chargingStation === null) {
            CommonException.notFoundException(this.logger, 'ChargingStation', 'name', name);
        }
        this.logger.log(`Returned ChargingStation with name '${name}'`);
        return chargingStation;
    }

    async getChargingStationByDeviceId(deviceId: string) {
        const chargingStation = await this.chargingStationRepository.getChargingStationByDeviceId(deviceId);
        if (chargingStation === null) {
            CommonException.notFoundException(this.logger, 'ChargingStation', 'deviceId', deviceId);
        }
        this.logger.log(`Returned ChargingStation with deviceId '${deviceId}'`);
        return chargingStation;
    }

    async getChargingStations(pageNumber: number, pageSize: number) {
        const chargingStations = await this.chargingStationRepository.getChargingStations(pageNumber, pageSize);
        const totalChargingStations = await this.chargingStationRepository.countTotalChargingStations();
        const totalPages = CommonPagination.countTotalPages(totalChargingStations, pageSize);

        this.logger.log(`Returned list of '${chargingStations.length}' ChargingStationType. PageNumber '${pageNumber}', pageSize '${pageSize}'`);
        return CommonPagination.paginate(chargingStations, new Pagination(pageNumber, pageSize, totalPages));
    }

    async updateChargingStation(id: string, updateChargingStationDto: UpdateChargingStationDto) {

    }
}
