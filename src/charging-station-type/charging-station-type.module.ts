import { Module } from '@nestjs/common';
import { ChargingStationTypeService } from './charging-station-type.service';
import { ChargingStationTypeController } from './charging-station-type.controller';

@Module({
  providers: [ChargingStationTypeService],
  controllers: [ChargingStationTypeController]
})
export class ChargingStationTypeModule {}
