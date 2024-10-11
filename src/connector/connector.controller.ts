import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query, ParseUUIDPipe } from '@nestjs/common';
import { ConnectorService } from './connector.service';
import { CreateConnectorDto } from './dto/create-connector.dto';
import { UpdateConnectorDto } from './dto/update-connector.dto';

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
  getConnectors(
    @Query('pageNumber', ParseIntPipe) pageNumber: number, 
    @Query('pageSize', ParseIntPipe) pageSize: number) {
      return this.connectorService.getConnectors(pageNumber, pageSize);
    }

  @Patch(':id')
  updateConnector(@Param('id', ParseUUIDPipe) id: string, @Body() updateConnectorDto: UpdateConnectorDto) {
    return this.connectorService.updateConnector(id, updateConnectorDto);
  }

  @Delete(':id')
  deleteConnector(@Param('id', ParseUUIDPipe) id: string) {
    
  }
}