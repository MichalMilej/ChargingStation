import { Body, Controller, Delete, Get, Param, ParseIntPipe, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ChargingStationTypeService } from './charging-station-type.service';
import { CreateChargingStationTypeDto } from './dto/create-charging-station-type.dto';
import { UpdateChargingStationTypeDto } from './dto/update-charging-station-type.dto';
import { ChargingStationTypeFilterDto } from './dto/charging-station-type.filter.dto';

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
    getChargingStationTypes(
        @Query('pageNumber', ParseIntPipe) pageNumber: number, 
        @Query('pageSize', ParseIntPipe) pageSize: number,
        @Query() chargingStationTypeFilterDto: ChargingStationTypeFilterDto) {
        return this.chargingStationTypeService.getChargingStationTypes(pageNumber, pageSize, chargingStationTypeFilterDto);
    }

    @Patch(':id')
    updateChargingStationType(@Param('id', ParseUUIDPipe) id: string,
        @Body() updateChargingStationTypeDto: UpdateChargingStationTypeDto) {
        return this.chargingStationTypeService.updateChargingStationType(id, updateChargingStationTypeDto);
    }

    @Delete(':id')
    deleteChargingStationType(@Param('id', ParseUUIDPipe) id: string) {
        return this.chargingStationTypeService.deleteChargingStationType(id);
    }

}
