import { Test } from "@nestjs/testing";
import { ConnectorService } from "./connector.service";
import { ConnectorRepository } from "./connector.repository";
import { ConflictException } from "@nestjs/common";

describe('ConnectorService', () => {
    let connectorService: ConnectorService;
    let mockedConnectionRepository: ConnectorRepository;

    const connectorId = '66a95bd6-8fba-4219-9669-b7e6c6cf84a2';
    const chargingStationId = 'f8b7556f-9ff3-4fcb-9847-57dc35d1fd27';
    const connectorDto = {
        id: connectorId,
        name: "default_connector",
        priority: false,
        chargingStationId: chargingStationId
    }

    beforeEach(async() => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                ConnectorService,
                {
                    provide: ConnectorRepository,
                    useValue: {
                        getConnectorById: jest.fn().mockResolvedValue(connectorDto),
                        getConnectorsByChargingStationId: jest.fn().mockResolvedValue([
                            {id: connectorId, priority: false, chargingStationId: chargingStationId},
                            {id: '8ab758c0-9abd-46d9-b5a9-aea7fdb6a23e', priority: false, chargingStationId: chargingStationId},
                            {id: 'd6108ac9-f71f-4c08-b8ed-152fd523f840', priority: true, chargingStationId: chargingStationId}
                        ]),
                        updateConnector: jest.fn().mockResolvedValue(connectorDto),
                        deleteConnector: jest.fn()
                    }
                }
            ]
        }).compile();

        connectorService = moduleRef.get(ConnectorService);
        mockedConnectionRepository = moduleRef.get(ConnectorRepository);
    })

    describe('updateConnector', () => {
        it('should update - no chargingStationId', async() => {
            mockedConnectionRepository.getConnectorById = jest.fn().mockResolvedValue({
                chargingStationId: null
            });
            const spy = jest.spyOn(mockedConnectionRepository, 'updateConnector');
            await connectorService.updateConnector(connectorId, {priority: true});
            expect(spy).toHaveBeenCalled();
        })

        it('should update - priority false', async() => {
            const spy = jest.spyOn(mockedConnectionRepository, 'updateConnector');
            await connectorService.updateConnector(connectorId, {priority: false});
            expect(spy).toHaveBeenCalled();
        })

        it('should throw ConflictException - two connectors would have priority set true', async() => {
            await expect(connectorService.updateConnector(connectorId, {priority: true})).rejects.toThrow(ConflictException);
        })

        it('should update - only one priority set true', async() => {
            mockedConnectionRepository.getConnectorsByChargingStationId = jest.fn().mockResolvedValue([
                {id: connectorId, priority: false, chargingStationId: chargingStationId},
                {id: '8ab758c0-9abd-46d9-b5a9-aea7fdb6a23e', priority: false, chargingStationId: chargingStationId},
                {id: 'd6108ac9-f71f-4c08-b8ed-152fd523f840', priority: false, chargingStationId: chargingStationId}
            ]);
            const spy = jest.spyOn(mockedConnectionRepository, 'updateConnector');
            await connectorService.updateConnector(connectorId, {priority: true});
            expect(spy).toHaveBeenCalled();
        })
    });

    describe('deleteConnector', () => {
        it ('should throw ConflictException - chargingStationId bound', async() => {
            await expect(connectorService.deleteConnector(connectorId)).rejects.toThrow(ConflictException);
        })

        it ('should delete', async() => {
            const spy = jest.spyOn(mockedConnectionRepository, 'deleteConnector');
            mockedConnectionRepository.getConnectorById = jest.fn().mockResolvedValue({ chargingStationId: null });
            await connectorService.deleteConnector(connectorId);
            expect(spy).toHaveBeenCalled();
        })
    })
});