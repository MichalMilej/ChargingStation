import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ChargingStationTypeService } from './charging-station-type.service';
import { CreateChargingStationTypeDto } from './dto/create-charging-station-type.dto';
import { UpdateChargingStationTypeDto } from './dto/update-charging-station-type.dto';

@Controller('charging-station-type')
export class ChargingStationTypeController {

    constructor(private readonly chargingStationTypeService: ChargingStationTypeService) {}

    @Post()
    async createChargingStationType(@Body() createChargingStationTypeDto: CreateChargingStationTypeDto) {
        return this.chargingStationTypeService.createChargingStationType(createChargingStationTypeDto);
    }

    @Get(':id')
    async getChargingStationTypeById(@Param('id') id: string) {
        return this.chargingStationTypeService.getChargingStationTypeById(id);
    }

    @Get('name/:name')
    async getChargingStationTypeByName(@Param('name') name: string) {
        return this.chargingStationTypeService.getChargingStationTypeByName(name);
    }

    @Get()
    async getChargingStationTypes(
        @Query('pageNumber', ParseIntPipe) pageNumber: number, 
        @Query('pageSize', ParseIntPipe) pageSize: number) {
        return this.chargingStationTypeService.getChargingStationTypes(pageNumber, pageSize);
    }

    @Patch(':id')
    async updateChargingStationType(@Param('id') id: string,
        @Body() updateChargingStationTypeDto: UpdateChargingStationTypeDto) {
        return this.chargingStationTypeService.updateChargingStationType(id, updateChargingStationTypeDto);
    }

    @Delete(':id')
    async deleteChargingStationType(@Param('id') id: string) {
        return this.chargingStationTypeService.deleteChargingStationType(id);
    }

}
