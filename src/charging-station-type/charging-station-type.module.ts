import { Module } from '@nestjs/common';
import { ChargingStationTypeService } from './charging-station-type.service';
import { ChargingStationTypeController } from './charging-station-type.controller';
import { ChargingStationTypeRepository } from './charging-station-type.repository';

@Module({
  providers: [ChargingStationTypeService, ChargingStationTypeRepository],
  controllers: [ChargingStationTypeController],
  exports: [ChargingStationTypeRepository]
})
export class ChargingStationTypeModule {}
