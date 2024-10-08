import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/common/database.service';
import { Prisma } from '@prisma/client';
import { ChargingStationTypeValidator } from './ch-station-type.validator';

@Injectable()
export class ChargingStationTypeService {

    constructor(private readonly databaseService: DatabaseService) {}

    async createChargingStationType(createChargingStationTypeDto: Prisma.ChargingStationTypeCreateInput) {
        return this.databaseService.chargingStationType.create({
            data: createChargingStationTypeDto
        });
    }


}
