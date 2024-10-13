import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { CreateConnectorDto } from './dto/create-connector.dto';
import { UpdateConnectorDto } from './dto/update-connector.dto';
import { ConnectorRepository } from './connector.repository';
import { CommonException } from 'src/common/common.exception';
import { CommonPagination, Pagination } from 'src/common/common.pagination';
import { ConnectorQueryDto } from './dto/connector.query.dto';

@Injectable()
export class ConnectorService {

  readonly logger: Logger;

  constructor(private readonly connectorRepository: ConnectorRepository) {
    this.logger = new Logger(ConnectorService.name);
  }

  async createConnector(createConnectorDto: CreateConnectorDto) {
    const newConnector = await this.connectorRepository.createConnector(createConnectorDto);
    this.logger.log(`Created Connector with id '${newConnector.id}'`);
    return newConnector;
  }

  async getConnectorById(id: string) {
    const connector = await this.retrieveConnectorById(id);
    this.logger.log(`Returned Connector with id '${id}'`);
    return connector;
  }

  async getConnectors(connectorQueryDto: ConnectorQueryDto) {
    const connectors = await this.connectorRepository.getConnectors(connectorQueryDto);
    const totalConnectors = await this.connectorRepository.countTotalConnectors();

    this.logger.log(`Returned list of '${connectors.length}' Connector`);
    return CommonPagination.paginate(connectors, new Pagination(connectorQueryDto, totalConnectors));
  }

  async updateConnector(id: string, updateConnectorDto: UpdateConnectorDto) {
    const connector = await this.retrieveConnectorById(id);
    if (updateConnectorDto.priority !== false && connector.chargingStationId !== null) {
      await this.validateConnectorsPriority(connector.chargingStationId);
    }
    const updatedConnector = await this.connectorRepository.updateConnector(id, updateConnectorDto);
    this.logger.log(`Updated connector with id '${id}'`);
    return updatedConnector;
  }

  async deleteConnector(id: string) {
    const connector = await this.retrieveConnectorById(id);
    if (connector.chargingStationId !== null) {
      throw CommonException.conflictException(this.logger, `Connector with id '${id}' bound to ChargingStation with id '${connector.chargingStationId}'`);
    }
    await this.connectorRepository.deleteConnector(id);
    this.logger.log(`Deleted Connector with id '${id}'`);
  }

  async validateConnectorsPriority(chargingStationId: string) {
    const connectors = await this.connectorRepository.getConnectorsByChargingStationId(chargingStationId);
    for (const connector of connectors) {
      if (connector.priority === true) {
        const message = `Connector with id '${connector.id}' bound to ChargingStation with id '${chargingStationId}' has priority set true`;
        this.logger.log(message);
        throw new ConflictException(message);
      }
    }
  }

  private async retrieveConnectorById(id: string) {
    const connector = await this.connectorRepository.getConnectorById(id);
    if (connector === null) {
      throw CommonException.notFoundException(this.logger, 'Connector', 'id', id);
    }
    return connector;
  }
}
