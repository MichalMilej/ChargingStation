import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ChargingStationTypeService } from './charging-station-type.service';
import { CreateChargingStationTypeDto } from './dto/create-charging-station-type.dto';
import { UpdateChargingStationTypeDto } from './dto/update-charging-station-type.dto';
import { ChargingStationTypeQueryDto } from './dto/charging-station-type.query.dto';

@Controller('charging-station-type')
export class ChargingStationTypeController {

    constructor(private readonly chargingStationTypeService: ChargingStationTypeService) {}

    @Post()
    createChargingStationType(@Body() createChargingStationTypeDto: CreateChargingStationTypeDto) {
        return this.chargingStationTypeService.createChargingStationType(createChargingStationTypeDto);
    }

    @Get(':id')
    getChargingStationTypeById(@Param('id', ParseUUIDPipe) id: string) {
        return this.chargingStationTypeService.getChargingStationTypeById(id);
    }

    @Get('name/:name')
    getChargingStationTypeByName(@Param('name') name: string) {
        return this.chargingStationTypeService.getChargingStationTypeByName(name);
    }

    @Get()
    getChargingStationTypes(@Query() chargingStationTypeQueryDto: ChargingStationTypeQueryDto) {
        return this.chargingStationTypeService.getChargingStationTypes(chargingStationTypeQueryDto);
    }

    @Patch(':id')
    updateChargingStationType(@Param('id', ParseUUIDPipe) id: string,
        @Body() updateChargingStationTypeDto: UpdateChargingStationTypeDto) {
        return this.chargingStationTypeService.updateChargingStationType(id, updateChargingStationTypeDto);
    }

    @Delete(':id')
    @HttpCode(204)
    deleteChargingStationType(@Param('id', ParseUUIDPipe) id: string) {
        return this.chargingStationTypeService.deleteChargingStationType(id);
    }

}
