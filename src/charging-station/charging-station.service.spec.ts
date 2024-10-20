import { Test } from "@nestjs/testing"
import { ChargingStationService } from "./charging-station.service";
import { ChargingStationRepository } from "./charging-station.repository";
import { BadRequestException, ConflictException, NotFoundException } from "@nestjs/common";
import { ChargingStationTypeRepository } from "../charging-station-type/charging-station-type.repository";
import { ConnectorRepository } from "../connector/connector.repository";


describe('ChargingStationService', () => {
    let chargingStationService: ChargingStationService;
    let mockedChargingStationRepository: ChargingStationRepository;
    let mockedChargingStationTypeRepository: ChargingStationTypeRepository;
    let mockedConnectorRepository: ConnectorRepository;

    const chargingStationId = '247de279-9ce9-4aee-b757-3ef8628e7710';
    const chargingStationTypeId = '588a245f-3c8c-46ad-b27b-8a77da52dc6c';
    const connectorsIds = ['f56518f0-3427-4c01-972c-fb42fd314071', '7172b017-7dea-4343-b4e7-6d85a005c5ce', '4b083def-940b-42a6-b208-a812a5a52278'];
    const createChargingStationDto = {
        name: 'default_charging_station',
        deviceId: 'default_device_id',
        ipAddress: '78.250.253.52',
        firmwareVersion: '0.1',
        chargingStationTypeId: chargingStationTypeId,
        connectorIds: connectorsIds
    }

    beforeEach(async() => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                ChargingStationService, {
                    provide: ChargingStationRepository,
                    useValue: {
                        getChargingStationById: jest.fn().mockResolvedValue({}),
                        getChargingStationByName: jest.fn().mockResolvedValue(null),
                        getChargingStationByDeviceId: jest.fn().mockResolvedValue(null),
                        createChargingStation: jest.fn(),
                        updateChargingStation: jest.fn(),
                        replaceConnector: jest.fn()
                    }
                }, {
                    provide: ChargingStationTypeRepository,
                    useValue: {
                        getChargingStationTypeById: jest.fn().mockResolvedValue({plugCount: 3, priority: false}),
                    }
                }, {
                    provide: ConnectorRepository,
                    useValue: {
                        getConnectorById: jest.fn().mockResolvedValue({chargingStationId: null}),
                        getConnectorsByChargingStationId: jest.fn().mockResolvedValue([
                            {id: connectorsIds[0], chargingStationId: chargingStationId, priority: false},
                            {id: connectorsIds[1], chargingStationId: chargingStationId, priority: true},
                            {id: connectorsIds[2], chargingStationId: chargingStationId, priority: false}
                        ])
                    }
                }
            ]
        }).compile();

        chargingStationService = moduleRef.get(ChargingStationService);
        mockedChargingStationRepository = moduleRef.get(ChargingStationRepository);
        mockedChargingStationTypeRepository = moduleRef.get(ChargingStationTypeRepository);
        mockedConnectorRepository = moduleRef.get(ConnectorRepository);
    })

    describe('createChargingStation', () => {
        it('should throw ConflictException - name conflict', async() => {
            mockedChargingStationRepository.getChargingStationByName = jest.fn().mockResolvedValue({});
            await expect(chargingStationService.createChargingStation(createChargingStationDto)).rejects.toThrow(ConflictException);
        })
        it ('should throw ConflictException - deviceId conflict', async() => {
            mockedChargingStationRepository.getChargingStationByDeviceId = jest.fn().mockResolvedValue({});
            await expect(chargingStationService.createChargingStation(createChargingStationDto)).rejects.toThrow(ConflictException);
        })
        it ('should throw NotFoundException - ChargingStationType not found', async() => {
            mockedChargingStationTypeRepository.getChargingStationTypeById = jest.fn().mockResolvedValue(null);
            await expect(chargingStationService.createChargingStation(createChargingStationDto)).rejects.toThrow(NotFoundException);
        })
        it ('should throw BadRequestException - Connectors not different', async() => {
            createChargingStationDto.connectorIds = ['f56518f0-3427-4c01-972c-fb42fd314071', 'f56518f0-3427-4c01-972c-fb42fd314071', 'f56518f0-3427-4c01-972c-fb42fd314071'];
            await expect(chargingStationService.createChargingStation(createChargingStationDto)).rejects.toThrow(BadRequestException);
            createChargingStationDto.connectorIds = connectorsIds;
        })
        it ('should throw NotFoundException - Connectors not found', async() => {
            mockedConnectorRepository.getConnectorById = jest.fn().mockResolvedValue(null);
            await expect(chargingStationService.createChargingStation(createChargingStationDto)).rejects.toThrow(NotFoundException);
        })
        it ('should throw BadRequestException - connectorIds length does not match ChargingStationType plugCount', async() => {
            mockedChargingStationTypeRepository.getChargingStationTypeById = jest.fn().mockResolvedValue({plugCount: 1})
            await expect(chargingStationService.createChargingStation(createChargingStationDto)).rejects.toThrow(BadRequestException);
        })
        it ('should throw ConflictException - Connector bound to different ChargingStation', async() => {
            mockedConnectorRepository.getConnectorById = jest.fn().mockResolvedValue({chargingStationId: 'f56518f0-3427-4c01-972c-fb42fd314071'})
            await expect(chargingStationService.createChargingStation(createChargingStationDto)).rejects.toThrow(ConflictException);
        })
        it ('should throw ConflictException - multiple connectors have priority set true', async() => {
            mockedConnectorRepository.getConnectorById = jest.fn().mockResolvedValue({priority: true})
            await expect(chargingStationService.createChargingStation(createChargingStationDto)).rejects.toThrow(ConflictException);
        })
        it ('should create', async() => {
            const spy = jest.spyOn(mockedChargingStationRepository, 'createChargingStation');
            await chargingStationService.createChargingStation(createChargingStationDto);
            expect(spy).toHaveBeenCalled();
        })
    })

    describe('updateChargingStation', () => {
        const newChargingStationId = 'f70b35ad-947b-4f0e-ad49-b287a63b0aad';
        const newConnectorsIds = ['f56518f0-3427-4c01-972c-fb42fd314071', '2319545a-996d-4858-82c7-8551643b5745'];
        const updateChargingStationDto = {
            chargingStationTypeId: newChargingStationId,
            connectorIds: newConnectorsIds
        }

        it ('should throw NotFoundException - id not found', async() => {
            mockedChargingStationRepository.getChargingStationById = jest.fn().mockResolvedValue(null);
            await expect(chargingStationService.updateChargingStation(chargingStationId, updateChargingStationDto)).rejects.toThrow(NotFoundException);
        })
        it ('should update', async() => {
            mockedChargingStationTypeRepository.getChargingStationTypeById = jest.fn().mockResolvedValue({plugCount: 2})
            const spy = jest.spyOn(mockedChargingStationRepository, 'updateChargingStation');
            await chargingStationService.updateChargingStation(chargingStationId, updateChargingStationDto);
            expect(spy).toHaveBeenCalled();
        })
    })
    
    describe('replaceConnector', () => {
        const connectorId = 'f56518f0-3427-4c01-972c-fb42fd314071';
        const replaceConnectorDto = { newConnectorId: '7ee2b324-efcc-4840-a299-e828d8cece02'};

        it ('should throw BadRequestException - Connector not bound to ChargingStation', async() => {
            mockedChargingStationRepository.getChargingStationById = jest.fn().mockResolvedValue({chargingStationId: null});
            await expect(chargingStationService.replaceConnector(connectorId, replaceConnectorDto)).rejects.toThrow(BadRequestException);
        })
        it ('should throw ConflictException - new Connector bound to different ChargingStation', async() => {
            mockedChargingStationRepository.getChargingStationById = jest.fn().mockResolvedValue({chargingStationId: chargingStationId});
            await expect(chargingStationService.replaceConnector(connectorId, replaceConnectorDto)).rejects.toThrow(BadRequestException);
        })
        it ('should throw ConflictException - multiple Connector would have priority set true', async() => {
            mockedConnectorRepository.getConnectorsByChargingStationId = jest.fn().mockResolvedValue([
                    {id: connectorId, chargingStationId: chargingStationId, priority: false},
                    {id: connectorsIds[1], chargingStationId: chargingStationId, priority: true},
                    {id: connectorsIds[2], chargingStationId: chargingStationId, priority: false}
            ])
            mockedConnectorRepository.getConnectorById = jest.fn().mockImplementation((id) => {
                if (id === connectorId)
                    return {chargingStationId: chargingStationId};
                else
                    return {chargingStationId: null, priority: true}
            })
            await expect(chargingStationService.replaceConnector(connectorId, replaceConnectorDto)).rejects.toThrow(ConflictException);
        })
        it ('should replace Connector', async() => {
            mockedConnectorRepository.getConnectorById = jest.fn().mockImplementation((id) => {
                if (id === connectorId)
                    return {chargingStationId: chargingStationId};
                else
                    return {chargingStationId: null, priority: false}
            })
            const spy = jest.spyOn(mockedChargingStationRepository, 'replaceConnector');
            await chargingStationService.replaceConnector(connectorId, replaceConnectorDto);
            expect(spy).toHaveBeenCalled();
        })
    })
})