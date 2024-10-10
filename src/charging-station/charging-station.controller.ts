import { Body, Controller, Post } from '@nestjs/common';
import { ChargingStationService } from './charging-station.service';
import { CreateChargingStationDto } from './dto/create-charging-station.dto';

@Controller('charging-station')
export class ChargingStationController {
  constructor(private readonly chargingStationService: ChargingStationService) {}

  @Post()
  createChargingStation(@Body() createChargingStationDto: CreateChargingStationDto) {
    return this.chargingStationService.createChargingStation(createChargingStationDto);
  }
}
