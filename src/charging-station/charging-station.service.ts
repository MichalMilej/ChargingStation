import { Injectable, Logger } from '@nestjs/common';
import { CreateChargingStationDto } from './dto/create-charging-station.dto';
import { ChargingStationRepository } from './charging-station.repository';
import { ChargingStationTypeRepository } from 'src/charging-station-type/charging-station-type.repository';
import { CommonException } from 'src/common/common.exception';
import { CommonPagination, Pagination } from 'src/common/common.pagination';
import { UpdateChargingStationDto } from './dto/update-charging-station.dto';
import { ConnectorRepository } from 'src/connector/connector.repository';

@Injectable()
export class ChargingStationService {
    private readonly logger: Logger;

    constructor(
        private readonly chargingStationRepository: ChargingStationRepository, 
        private readonly chargingStationTypeRepository: ChargingStationTypeRepository,
        private readonly connectorRepository: ConnectorRepository
    ) {
        this.logger = new Logger(ChargingStationService.name);
    }

    async createChargingStation(createChargingStationDto: CreateChargingStationDto) {
        this.validateConnectorIdsDifferent(createChargingStationDto.connectorIds);
        await this.validateNameConflict(createChargingStationDto.name);
        await this.validateDeviceIdConflict(createChargingStationDto.deviceId);
        await this.validateChargingStationTypeIdExists(createChargingStationDto.chargingStationTypeId);
        await this.validateConnectorIds(createChargingStationDto);

        const newChargingStation = await this.chargingStationRepository.createChargingStation(createChargingStationDto);
        this.logger.log(`Created ChargingStation with id '${newChargingStation}'`);
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

        this.logger.log(`Returned list of '${chargingStations.length}' ChargingStation. PageNumber '${pageNumber}', pageSize '${pageSize}'`);
        return CommonPagination.paginate(chargingStations, new Pagination(pageNumber, pageSize, totalPages));
    }

    async updateChargingStation(id: string, updateChargingStationDto: UpdateChargingStationDto) {
        if (await this.chargingStationRepository.getChargingStationById(id) === null) {
            throw CommonException.notFoundException(this.logger, 'ChargingStation', 'id', id);
        }
        if (updateChargingStationDto.name !== undefined) {
            await this.validateNameConflict(updateChargingStationDto.name);
        }
        if (updateChargingStationDto.deviceId !== undefined) {
            await this.validateDeviceIdConflict(updateChargingStationDto.deviceId);
        }
        if (updateChargingStationDto.chargingStationTypeId !== undefined) {
            await this.validateChargingStationTypeIdExists(updateChargingStationDto.chargingStationTypeId);
        }
        const updatedChargingStation = await this.chargingStationRepository.updateChargingStation(id, updateChargingStationDto);
        this.logger.log(`Updated ChargingStation with id '${id}'`);('');
        return updateChargingStationDto;
    }

    private async validateNameConflict(name: string) {
        if (await this.chargingStationRepository.getChargingStationByName(name) !== null) {
            CommonException.conflictException(this.logger, 'ChargingStation', 'name', name);
        }
    }

    private async validateDeviceIdConflict(deviceId: string) {
        if (await this.chargingStationRepository.getChargingStationByDeviceId(deviceId) !== null) {
            CommonException.conflictException(this.logger, "ChargingStation", 'deviceId', deviceId);
        }
    }

    private async validateChargingStationTypeIdExists(chargingStationTypeId: string) {
        if (await this.chargingStationTypeRepository.getChargingStationTypeById(chargingStationTypeId) === null) {
            CommonException.notFoundException(this.logger, 'ChargingStationType', 'chargingStationTypeId', chargingStationTypeId);
        }
    }

    private async validateConnectorIds(createChargingStationDto: CreateChargingStationDto) {
        await this.validateConnectorIdsExists(createChargingStationDto.connectorIds);
        await this.validateConnectorsPlugCount(createChargingStationDto.chargingStationTypeId, createChargingStationDto.connectorIds);
        await this.validateConnectorsFree(createChargingStationDto.connectorIds);
        await this.validateConnectorsPriority(createChargingStationDto.connectorIds);
    }

    private validateConnectorIdsDifferent(connectorIds: string[]) {
        if (new Set(connectorIds).size !== connectorIds.length) {
            CommonException.badRequestException(this.logger, 'ConnectorIds in request duplicated');
        }
    }

    private async validateConnectorIdsExists(connectorIds: string[]) {
        for (const id of connectorIds) {
            if (await this.connectorRepository.getConnectorById(id) === null) {
                CommonException.notFoundException(this.logger, 'Connector', 'id', id);
            }
        }
    }

    private async validateConnectorsPlugCount(chargingStationTypeId: string, connectorIds: string[]) {
        const chargingStationType = await this.chargingStationTypeRepository.getChargingStationTypeById(chargingStationTypeId);
        const plugCount = chargingStationType?.plugCount;
        if (connectorIds.length !== plugCount) {
            CommonException.badRequestException(this.logger, `PlugCount size, which is '${plugCount}' not match connectorIds size`);
        }
    }

    private async validateConnectorsFree(connectorIds: string[]) {
        for (const connectorId of connectorIds) {
            const connector = await this.connectorRepository.getConnectorById(connectorId);
            if (connector?.chargingStationId !== null) {
                CommonException.badRequestException(this.logger, `Connector with id '${connectorId}' is bound to different ChargingStation`);
            }
        }
    }

    private async validateConnectorsPriority(connectorIds: string[]) {
        let priorityTrueCount = 0;
        for (const connectorId of connectorIds) {
            const connector = await this.connectorRepository.getConnectorById(connectorId);
            if (connector?.priority === true) {
                priorityTrueCount++;
            }
            if (priorityTrueCount > 1) {
                CommonException.badRequestException(this.logger, 'Multiple connectors have priority set true');
            }
        }
    }
}
