import { Body, Controller, Get, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { ChargingStationService } from './charging-station.service';
import { CreateChargingStationDto } from './dto/create-charging-station.dto';

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

}
