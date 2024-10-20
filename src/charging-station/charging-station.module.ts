import { Module } from '@nestjs/common';
import { ChargingStationService } from './charging-station.service';
import { ChargingStationController } from './charging-station.controller';
import { ChargingStationTypeModule } from '../charging-station-type/charging-station-type.module';
import { ChargingStationRepository } from './charging-station.repository';
import { ConnectorModule } from '../connector/connector.module';

@Module({
  imports: [ChargingStationTypeModule, ConnectorModule],
  controllers: [ChargingStationController],
  providers: [ChargingStationService, ChargingStationRepository],
  exports: [ChargingStationRepository]
})
export class ChargingStationModule {}
