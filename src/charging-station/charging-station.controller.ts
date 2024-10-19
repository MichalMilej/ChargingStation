import { Body, Controller, Delete, Get, HttpCode, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ChargingStationService } from './charging-station.service';
import { CreateChargingStationDto } from './dto/create-charging-station.dto';
import { UpdateChargingStationDto } from './dto/update-charging-station.dto';
import { ChargingStationQueryDto } from './dto/charging-station.query.dto';
import { ReplaceConnectorDto } from './dto/replace-connector.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('charging-stations')
export class ChargingStationController {
  constructor(private readonly chargingStationService: ChargingStationService) {}

  @Post()
  createChargingStation(@Body() createChargingStationDto: CreateChargingStationDto) {
    return this.chargingStationService.createChargingStation(createChargingStationDto);
  }

  @Get(':id')
  getChargingStationById(@Param('id', ParseUUIDPipe) id: string) {
    return this.chargingStationService.getChargingStationById(id);
  }

  @Get('name/:name')
  getChargingStationByName(@Param('name') name: string) {
    return this.chargingStationService.getChargingStationByName(name);
  }

  @Get('device-id/:deviceId')
  getChargingStationByDeviceId(@Param('deviceId', ParseUUIDPipe) deviceId: string) {
    return this.chargingStationService.getChargingStationByDeviceId(deviceId);
  }

  @Get()
  getChargingStations(
    @Query() chargingStationQueryDto: ChargingStationQueryDto) {
    return this.chargingStationService.getChargingStations(chargingStationQueryDto);
  }

  @Patch(':id')
  updateChargingStation(@Param('id', ParseUUIDPipe) id: string, @Body() updateChargingStationDto: UpdateChargingStationDto) {
    return this.chargingStationService.updateChargingStation(id, updateChargingStationDto);
  }

  @Patch('connector/:connectorId')
  replaceConnector(@Param('connectorId', ParseUUIDPipe) connectorId: string, @Body() replaceConnectorDto: ReplaceConnectorDto) {
    return this.chargingStationService.replaceConnector(connectorId, replaceConnectorDto);
  }

  @Delete(':id')
  @HttpCode(204)
  deleteChargingStation(@Param('id', ParseUUIDPipe) id: string) {
    return this.chargingStationService.deleteChargingStation(id);
  }

}
