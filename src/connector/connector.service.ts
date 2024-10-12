import { Injectable, Logger } from '@nestjs/common';
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
    const connector = await this.connectorRepository.getConnectorById(id);
    if (connector === null) {
      CommonException.notFoundException(this.logger, 'Connector', 'id', id);
    }
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

  }
}
