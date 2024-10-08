import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { ChargingStationTypeModule } from './ch-station-type/ch-station-type.module';

@Module({
  imports: [CommonModule, ChargingStationTypeModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
