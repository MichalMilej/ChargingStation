import { Injectable, Logger } from '@nestjs/common';
import { CreateChargingStationDto } from './dto/create-charging-station.dto';
import { ChargingStationRepository } from './charging-station.repository';
import { ChargingStationTypeRepository } from 'src/charging-station-type/charging-station-type.repository';
import { CommonException } from 'src/common/common.exception';
import { CommonPagination, Pagination } from 'src/common/common.pagination';
import { UpdateChargingStationDto } from './dto/update-charging-station.dto';
import { ConnectorRepository } from 'src/connector/connector.repository';
import { ChargingStationQueryDto } from './dto/charging-station.query.dto';
import { ReplaceConnectorDto } from './dto/replace-connector.dto';

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
        await this.validateNameConflict(createChargingStationDto.name);
        await this.validateDeviceIdConflict(createChargingStationDto.deviceId);
        await this.validateChargingStationTypeIdExists(createChargingStationDto.chargingStationTypeId);
        await this.validateConnectorIds(createChargingStationDto.connectorIds, createChargingStationDto.chargingStationTypeId);

        const newChargingStation = await this.chargingStationRepository.createChargingStation(createChargingStationDto);
        this.logger.log(`Created ChargingStation with id '${newChargingStation}'`);
        return newChargingStation;
    }

    async getChargingStationById(id: string) {
        const chargingStation = await this.retrieveChargingStationById(id);
        this.logger.log(`Returned ChargingStation with id '${id}'`);
        return chargingStation;
    }

    async getChargingStationByName(name: string) {
        const chargingStation = await this.chargingStationRepository.getChargingStationByName(name);
        if (chargingStation === null) {
            throw CommonException.notFoundException(this.logger, 'ChargingStation', 'name', name);
        }
        this.logger.log(`Returned ChargingStation with name '${name}'`);
        return chargingStation;
    }

    async getChargingStationByDeviceId(deviceId: string) {
        const chargingStation = await this.chargingStationRepository.getChargingStationByDeviceId(deviceId);
        if (chargingStation === null) {
            throw CommonException.notFoundException(this.logger, 'ChargingStation', 'deviceId', deviceId);
        }
        this.logger.log(`Returned ChargingStation with deviceId '${deviceId}'`);
        return chargingStation;
    }

    async getChargingStations(chargingStationQueryDto: ChargingStationQueryDto) {
        const chargingStations = await this.chargingStationRepository.getChargingStations(chargingStationQueryDto);
        const totalChargingStations = await this.chargingStationRepository.countTotalChargingStations();

        this.logger.log(`Returned list of '${chargingStations.length}' ChargingStation`);
        return CommonPagination.paginate(chargingStations, new Pagination(chargingStationQueryDto, totalChargingStations));
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
            if (updateChargingStationDto.connectorIds === undefined) {
                throw CommonException.badRequestException(this.logger, `ConnectorIds not specified`);
            }
            await this.validateChargingStationTypeIdExists(updateChargingStationDto.chargingStationTypeId);
            await this.validateConnectorIds(updateChargingStationDto.connectorIds, updateChargingStationDto.chargingStationTypeId, id);
        }
        const updatedChargingStation = await this.chargingStationRepository.updateChargingStation(id, updateChargingStationDto);
        this.logger.log(`Updated ChargingStation with id '${id}'`);('');
        return updatedChargingStation;
    }

    async replaceConnector(connectorId: string, replaceConnectorDto: ReplaceConnectorDto) {
        const oldConnector = await this.retrieveConnectorById(connectorId);
        if (oldConnector.chargingStationId === null) {
            throw CommonException.badRequestException(this.logger, `Connector with id '${connectorId}' is not bound to ChargingStation'`);
        }
        const newConnector = await this.retrieveConnectorById(replaceConnectorDto.newConnectorId);
        if (newConnector.chargingStationId !== null) {
            throw CommonException.conflictException(this.logger, `Connector '${replaceConnectorDto.newConnectorId}' is bound to different ChargingStation`);
        }
        if (newConnector.priority === true) {
            await this.validateConnectorsPriorityToReplaceConnector(oldConnector.chargingStationId, oldConnector.id);
        }
        const result = await this.chargingStationRepository.replaceConnector(oldConnector.chargingStationId, connectorId, replaceConnectorDto);
        this.logger.log(`Replaced connector with id '${connectorId}' with connector with id '${replaceConnectorDto.newConnectorId}' in ChargingStation`);
        return result;
    }

    async deleteChargingStation(id: string) {
        await this.retrieveChargingStationById(id);
        await this.chargingStationRepository.deleteChargingStation(id);
        this.logger.log(`Deleted ChargingStation with id '${id}'`);
    }

    private async retrieveChargingStationById(id: string) {
        const chargingStation = await this.chargingStationRepository.getChargingStationById(id);
        if (chargingStation === null) {
            throw CommonException.notFoundException(this.logger, 'ChargingStation', 'id', id);
        }
        return chargingStation;
    }

    private async retrieveConnectorById(id: string) {
        const connector = await this.connectorRepository.getConnectorById(id);
        if (connector === null) {
            throw CommonException.notFoundException(this.logger, 'Connector', 'id', id);
        }
        return connector;
    }

    private async validateNameConflict(name: string) {
        if (await this.chargingStationRepository.getChargingStationByName(name) !== null) {
            throw CommonException.alreadyInDatabaseException(this.logger, 'ChargingStation', 'name', name);
        }
    }

    private async validateDeviceIdConflict(deviceId: string) {
        if (await this.chargingStationRepository.getChargingStationByDeviceId(deviceId) !== null) {
            throw CommonException.alreadyInDatabaseException(this.logger, "ChargingStation", 'deviceId', deviceId);
        }
    }

    private async validateChargingStationTypeIdExists(chargingStationTypeId: string) {
        if (await this.chargingStationTypeRepository.getChargingStationTypeById(chargingStationTypeId) === null) {
            throw CommonException.notFoundException(this.logger, 'ChargingStationType', 'chargingStationTypeId', chargingStationTypeId);
        }
    }

    private async validateConnectorIds(connectorIds: string[], chargingStationTypeId: string, skipChargingStationWithId?: string) {
        this.validateConnectorIdsDifferent(connectorIds);
        await this.validateConnectorIdsExists(connectorIds);
        await this.validateConnectorsPlugCount(chargingStationTypeId, connectorIds);
        await this.validateConnectorsFree(connectorIds, skipChargingStationWithId);
        await this.validateConnectorsPriority(connectorIds);
    }

    private validateConnectorIdsDifferent(connectorIds: string[]) {
        if (new Set(connectorIds).size !== connectorIds.length) {
            throw CommonException.badRequestException(this.logger, 'ConnectorIds in request duplicated');
        }
    }

    private async validateConnectorIdsExists(connectorIds: string[]) {
        for (const id of connectorIds) {
            if (await this.connectorRepository.getConnectorById(id) === null) {
                throw CommonException.notFoundException(this.logger, 'Connector', 'id', id);
            }
        }
    }

    private async validateConnectorsPlugCount(chargingStationTypeId: string, connectorIds: string[]) {
        const chargingStationType = await this.chargingStationTypeRepository.getChargingStationTypeById(chargingStationTypeId);
        const plugCount = chargingStationType?.plugCount;
        if (connectorIds.length !== plugCount) {
            throw CommonException.badRequestException(this.logger, `PlugCount size, which is '${plugCount}' not match connectorIds size`);
        }
    }

    private async validateConnectorsFree(connectorIds: string[], skipChargingStationWithId?: string) {
        for (const connectorId of connectorIds) {
            const connector = await this.connectorRepository.getConnectorById(connectorId);
            if (connector?.chargingStationId !== null && connector?.chargingStationId !== skipChargingStationWithId) {
                throw CommonException.badRequestException(this.logger, `Connector with id '${connectorId}' is bound to different ChargingStation`);
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
                throw CommonException.badRequestException(this.logger, 'Multiple connectors have priority set true');
            }
        }
    }

    private async validateConnectorsPriorityToReplaceConnector(chargingStationId: string, oldConnectorId: string) {
        const chargingStationConnectors = await this.connectorRepository.getConnectorsByChargingStationId(chargingStationId);
            for (const connector of chargingStationConnectors) {
                if (connector.id === oldConnectorId) {
                    continue;
                }
                if (connector.priority === true) {
                    throw CommonException.badRequestException(this.logger, 'Multiple connectors would have priority set true');
                }
            }
    }
}
