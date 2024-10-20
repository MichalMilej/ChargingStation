import { Test } from "@nestjs/testing"
import { ChargingStationTypeService } from "./charging-station-type.service";
import { ChargingStationTypeRepository } from "./charging-station-type.repository";
import { CurrentType } from "@prisma/client";
import { ConflictException, NotFoundException } from "@nestjs/common";


describe('ChargingStationTypeService', () => {
    let chargingStationTypeService: ChargingStationTypeService;
    let mockedChargingStationTypeRepository: ChargingStationTypeRepository;

    const chargingStationTypeId = "29ebc934-6d86-4321-b152-09fa2e90de3b";
    const chargingStationTypeDto = {
        id: chargingStationTypeId,
        name: "default_charging_station_type",
        plugCount: 3,
        efficiency: 30,
        currentType: CurrentType.AC
    }
    const updateDto = {
        name: "updatedChargingStationType",
        plugCount: 1
    };

    beforeEach(async() => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                ChargingStationTypeService,
                {
                    provide: ChargingStationTypeRepository,
                    useValue: {
                        getChargingStationTypeById: jest.fn().mockResolvedValue(chargingStationTypeDto),
                        getChargingStationTypeByName: jest.fn().mockResolvedValue(chargingStationTypeDto),
                        updateChargingStationType: jest.fn().mockResolvedValue(updateDto),
                        countChargingStationsWithChargingStationType: jest.fn().mockResolvedValue(0)
                    }
                }
            ]
        }).compile();

        chargingStationTypeService = moduleRef.get(ChargingStationTypeService);
        mockedChargingStationTypeRepository = moduleRef.get(ChargingStationTypeRepository);
    })

    describe('getChargingStationType', () => {
        it ('should throw notFoundException - id not found', async() => {
            mockedChargingStationTypeRepository.getChargingStationTypeById = jest.fn().mockResolvedValue(null);
            await expect(chargingStationTypeService.getChargingStationTypeById(chargingStationTypeId)).rejects.toThrow(NotFoundException);
        })

        it ('should return ChargingStationTypeById', async() => {
            const result = await chargingStationTypeService.getChargingStationTypeById(chargingStationTypeId);
            expect(result).toEqual(chargingStationTypeDto);
        })

        it ('should throw notFoundException - name not found', async() => {
            mockedChargingStationTypeRepository.getChargingStationTypeByName = jest.fn().mockResolvedValue(null);
            await expect(chargingStationTypeService.getChargingStationTypeByName(chargingStationTypeId)).rejects.toThrow(NotFoundException);
        })

        it ('should return ChargingStationTypeByName', async() => {
            const result = await chargingStationTypeService.getChargingStationTypeById(chargingStationTypeId);
            expect(result).toEqual(chargingStationTypeDto);
        })
    })

    describe('updateChargingStationType', () => {
        it ('should update', async() => {
            mockedChargingStationTypeRepository.getChargingStationTypeByName = jest.fn().mockResolvedValue(null);
            const spy = jest.spyOn(mockedChargingStationTypeRepository, 'updateChargingStationType');
            await chargingStationTypeService.updateChargingStationType(chargingStationTypeId, updateDto);
            expect(spy).toHaveBeenCalled();
        })

        it ('should throw ConflictException - name conflict', async() => {
            await expect(chargingStationTypeService.updateChargingStationType(chargingStationTypeId, updateDto)).rejects.toThrow(ConflictException);
        })

        it ('should throw NotFoundException - id not found', async() => {
            mockedChargingStationTypeRepository.getChargingStationTypeById = jest.fn().mockResolvedValue(null);
            await expect(chargingStationTypeService.updateChargingStationType(chargingStationTypeId, updateDto)).rejects.toThrow(NotFoundException);
        })

        it ('should throw ConflictException - bound to ChargingStations', async() => {
            mockedChargingStationTypeRepository.getChargingStationTypeByName = jest.fn().mockResolvedValue(null);
            mockedChargingStationTypeRepository.countChargingStationsWithChargingStationType = jest.fn().mockResolvedValue(1);
            await expect(chargingStationTypeService.updateChargingStationType(chargingStationTypeId, updateDto)).rejects.toThrow(ConflictException);
        })
    })
})