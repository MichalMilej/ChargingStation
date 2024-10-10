import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateChargingStationDto } from './dto/create-charging-station.dto';
import { ChargingStationRepository } from './charging-station.repository';
import { ChargingStationTypeRepository } from 'src/charging-station-type/charging-station-type.repository';

@Injectable()
export class ChargingStationService {
    private readonly logger: Logger;

    constructor(
        private readonly chargingStationRepository: ChargingStationRepository, 
        private readonly chargingStationTypeRepository: ChargingStationTypeRepository
    ) {
        this.logger = new Logger(ChargingStationService.name);
    }

    async createChargingStation(createChargingStationDto: CreateChargingStationDto) {
        const name = createChargingStationDto.name;
        if (await this.chargingStationRepository.getChargingStationByName(name) !== null) {
            const message = `ChargingStation with name '${name}' already exists in database`;
            this.logger.log(message);
            throw new ConflictException(message);
        }
        const deviceId = createChargingStationDto.deviceId;
        if (await this.chargingStationRepository.getChargingStationByDeviceId(deviceId) !== null) {
            const message = `ChargingStation with deviceId '${deviceId}' already exists in database`;
            this.logger.log(message);
            throw new ConflictException(message);
        }
        const chargingStationTypeId = createChargingStationDto.chargingStationTypeId;
        if (await this.chargingStationTypeRepository.getChargingStationTypeById(chargingStationTypeId) === null) {
            const message = `ChargingStationType with id '${chargingStationTypeId}' not found`;
            this.logger.log(message);
            throw new NotFoundException(message);
        }
        const newChargingStation = await this.chargingStationRepository.createChargingStation(createChargingStationDto);
        this.logger.log(`Created ChargingStation with id '${newChargingStation.id}'`);
        return newChargingStation;
    }
}
