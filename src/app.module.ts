import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { ChargingStationTypeModule } from './charging-station-type/charging-station-type.module';

@Module({
  imports: [CommonModule, ChargingStationTypeModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
