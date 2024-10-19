import { Test } from "@nestjs/testing";
import { ConnectorService } from "./connector.service";
import { ConnectorRepository } from "./connector.repository";
import { ConflictException } from "@nestjs/common";

describe('ConnectorService', () => {
    let connectorService: ConnectorService;
    let mockedConnectionRepository: ConnectorRepository;

    const connectorId = '66a95bd6-8fba-4219-9669-b7e6c6cf84a2';
    const chargingStationId = 'f8b7556f-9ff3-4fcb-9847-57dc35d1fd27';

    beforeEach(async() => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                ConnectorService,
                {
                    provide: ConnectorRepository,
                    useValue: {
                        getConnectorById: jest.fn().mockImplementation(() => {
                            return {
                                id: connectorId,
                                name: "default_connector",
                                priority: false,
                                chargingStationId: chargingStationId
                            }
                        }),
                        getConnectorsByChargingStationId: jest.fn().mockImplementation(chargingStationId => {
                            return [
                                    {id: connectorId, priority: false, chargingStationId: chargingStationId},
                                    {id: '8ab758c0-9abd-46d9-b5a9-aea7fdb6a23e', priority: false, chargingStationId: chargingStationId},
                                    {id: 'd6108ac9-f71f-4c08-b8ed-152fd523f840', priority: true, chargingStationId: chargingStationId}
                                ];
                        }),
                        updateConnector: jest.fn(),
                        deleteConnector: jest.fn()
                    }
                }
            ]
        }).compile();

        connectorService = moduleRef.get(ConnectorService);
        mockedConnectionRepository = moduleRef.get(ConnectorRepository);
    })

    describe('updateConnector - validate priority', () => {
        it('should pass - no chargingStationId', async() => {
            mockedConnectionRepository.getConnectorById = jest.fn().mockImplementation((id) => {
                return {
                    id: connectorId,
                    chargingStationId: null
                }
            })
           await connectorService.updateConnector(connectorId, {priority: true});
        })

        it('should pass - priority false', async() => {
            await connectorService.updateConnector(connectorId, {priority: false});
        })

        it('should throw ConflictException - two connectors would have priority set true', async() => {
            await expect(connectorService.updateConnector(connectorId, {priority: true})).rejects.toThrow(ConflictException);
        })

        it('should pass - only one priority set true', async() => {
            mockedConnectionRepository.getConnectorsByChargingStationId = jest.fn().mockImplementation(chargingStationId => {
                return [
                        {id: connectorId, priority: false, chargingStationId: chargingStationId},
                        {id: '8ab758c0-9abd-46d9-b5a9-aea7fdb6a23e', priority: false, chargingStationId: chargingStationId},
                        {id: 'd6108ac9-f71f-4c08-b8ed-152fd523f840', priority: false, chargingStationId: chargingStationId}
                    ];
            });
            await connectorService.updateConnector(connectorId, {priority: true});
        })
    });

    describe('deleteConnector - validate', () => {
        it ('should throw ConflictException - chargingStationId bound', async() => {
            await expect(connectorService.deleteConnector(connectorId)).rejects.toThrow(ConflictException);
        })

        it ('should pass', async() => {
            mockedConnectionRepository.getConnectorById = jest.fn().mockImplementation(() => {
                return {
                    chargingStationId: null
                }
            })
            await connectorService.deleteConnector(connectorId);
        })
    })
});