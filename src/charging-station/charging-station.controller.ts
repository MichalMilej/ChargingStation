import { Body, Controller, Get, Param, ParseIntPipe, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ChargingStationService } from './charging-station.service';
import { CreateChargingStationDto } from './dto/create-charging-station.dto';
import { UpdateChargingStationDto } from './dto/update-charging-station.dto';

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
  async getChargingStations(
    @Query('pageNumber', ParseIntPipe) pageNumber: number, 
    @Query('pageSize', ParseIntPipe) pageSize: number) {
    return this.chargingStationService.getChargingStations(pageNumber, pageSize);
  }

  @Patch(':id')
  async updateChargingStation(@Param('id', ParseUUIDPipe) id: string, @Body() updateChargingStationDto: UpdateChargingStationDto) {
    return this.chargingStationService.updateChargingStation(id, updateChargingStationDto);
  }
}
