import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { ChargingStationTypeModule } from './charging-station-type/charging-station-type.module';
import { ChargingStationModule } from './charging-station/charging-station.module';

@Module({
  imports: [CommonModule, ChargingStationTypeModule, ChargingStationModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
