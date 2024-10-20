import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { ChargingStationTypeModule } from './charging-station-type/charging-station-type.module';
import { ChargingStationModule } from './charging-station/charging-station.module';
import { ConnectorModule } from './connector/connector.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [CommonModule, ChargingStationTypeModule, ChargingStationModule, ConnectorModule, AuthModule,
    ConfigModule.forRoot({
      isGlobal: true
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
