import { Module } from '@nestjs/common';
import { ChargingStationTypeService } from './ch-station-type.service';
import { ChargingStationTypeController } from './ch-station-type.controller';

@Module({
  providers: [ChargingStationTypeService],
  controllers: [ChargingStationTypeController]
})
export class ChargingStationTypeModule {}
