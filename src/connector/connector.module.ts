import { Module } from '@nestjs/common';
import { ConnectorService } from './connector.service';
import { ConnectorController } from './connector.controller';
import { ConnectorRepository } from './connector.repository';

@Module({
  controllers: [ConnectorController],
  providers: [ConnectorService, ConnectorRepository],
})
export class ConnectorModule {}
