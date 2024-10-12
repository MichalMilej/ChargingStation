import { Body, Controller, Get, Param, ParseIntPipe, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ChargingStationService } from './charging-station.service';
import { CreateChargingStationDto } from './dto/create-charging-station.dto';
import { UpdateChargingStationDto } from './dto/update-charging-station.dto';
import { ChargingStationQueryDto } from './dto/charging-station.query.dto';
import { PaginationDto } from 'src/common/pagination.dto';

@Controller('charging-station')
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
}
