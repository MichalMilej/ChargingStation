import { Body, Controller, Post } from '@nestjs/common';
import { ChargingStationTypeService } from './ch-station-type.service';
import { Prisma } from '@prisma/client';

@Controller('charging-station-type')
export class ChargingStationTypeController {

    constructor(private readonly chargingStationTypeService: ChargingStationTypeService) {}

    @Post()
    async createChargingStationType(@Body() createChargingStationTypeDto: Prisma.ChargingStationTypeCreateInput) {
        this.chargingStationTypeService.createChargingStationType(createChargingStationTypeDto);
    }

}
