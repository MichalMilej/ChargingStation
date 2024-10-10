import { Module } from '@nestjs/common';
import { ChargingStationService } from './charging-station.service';
import { ChargingStationController } from './charging-station.controller';
import { ChargingStationTypeModule } from 'src/charging-station-type/charging-station-type.module';
import { ChargingStationRepository } from './charging-station.repository';

@Module({
  imports: [ChargingStationTypeModule],
  controllers: [ChargingStationController],
  providers: [ChargingStationService, ChargingStationRepository],
  exports: [ChargingStationRepository]
})
export class ChargingStationModule {}