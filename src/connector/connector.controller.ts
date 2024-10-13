import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe, HttpCode } from '@nestjs/common';
import { ConnectorService } from './connector.service';
import { CreateConnectorDto } from './dto/create-connector.dto';
import { UpdateConnectorDto } from './dto/update-connector.dto';
import { ConnectorQueryDto } from './dto/connector.query.dto';

@Controller('connector')
export class ConnectorController {
  constructor(private readonly connectorService: ConnectorService) {}

  @Post()
  create(@Body() createConnectorDto: CreateConnectorDto) {
    return this.connectorService.createConnector(createConnectorDto);
  }

  @Get(':id')
  getConnectorById(@Param('id', ParseUUIDPipe) id: string) {
    return this.connectorService.getConnectorById(id);
  }

  @Get()
  getConnectors(@Query() connectorQueryDto: ConnectorQueryDto) {
      return this.connectorService.getConnectors(connectorQueryDto);
    }

  @Patch(':id')
  updateConnector(@Param('id', ParseUUIDPipe) id: string, @Body() updateConnectorDto: UpdateConnectorDto) {
    return this.connectorService.updateConnector(id, updateConnectorDto);
  }

  @Delete(':id')
  @HttpCode(204)
  deleteConnector(@Param('id', ParseUUIDPipe) id: string) {
    this.connectorService.deleteConnector(id);
  }
}
