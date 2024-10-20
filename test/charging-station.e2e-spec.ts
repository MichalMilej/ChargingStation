import { INestApplication, ValidationPipe } from "@nestjs/common"
import { Test, TestingModule } from "@nestjs/testing"
import * as request from 'supertest';
import { AppModule } from "../src/app.module";
import { AuthGuard } from "../src/auth/auth.guard";
import { AuthMockGuard } from "./auth.mock.guard";
import { ChargingStationService } from "../src/charging-station/charging-station.service";

describe('ChargingStationController (e2e)', () => {
    let app: INestApplication;
    let mockedChargingStationService: ChargingStationService;

    beforeAll(async() => {
        const moduleRef: TestingModule = await Test.createTestingModule({
            imports: [AppModule]
        })
        .overrideProvider(AuthGuard)
        .useClass(AuthMockGuard)
        .compile();

        app = moduleRef.createNestApplication();
        mockedChargingStationService = moduleRef.get(ChargingStationService);

        app.useGlobalPipes(new ValidationPipe({
            transform: true,
            whitelist: true,
            forbidNonWhitelisted: true
        }));
        await app.init();
    })

    it('should create ChargingStation', async() => {
        mockedChargingStationService.createChargingStation = jest.fn();
        await request(app.getHttpServer())
            .post('/charging-stations')
            .send({
                name: 'ch1',
                deviceId: 'b23c0344-009b-4300-abe4-cdb91e5e3757',
                ipAddress: 'c19b:9120:92a4:a16b:820e:d4cc:2a0c:5b3a',
                firmwareVersion: '0.7',
                chargingStationTypeId: '3e8217e4-966d-4327-9f8a-ee952fb6f2f8',
                connectorIds: [
                    'a979d893-ebc6-4c60-8d0a-a7e3438831ee'
                ]
            })
            .expect(201);
    })
    
    it('should get ChargingStation by id', async() => {
        mockedChargingStationService.getChargingStationById = jest.fn();
        await request(app.getHttpServer())
            .get('/charging-stations/a23c0344-009b-4300-abe4-cdb91e5e3757')
            .expect(200);
    })
    it('should get ChargingStation by name', async() => {
        mockedChargingStationService.getChargingStationByName = jest.fn();
        await request(app.getHttpServer())
            .get('/charging-stations/name/ch1')
            .expect(200);
    })
    it('should get ChargingStation by deviceId', async() => {
        mockedChargingStationService.getChargingStationByDeviceId = jest.fn();
        await request(app.getHttpServer())
            .get('/charging-stations/device-id/e23c0344-009b-4300-abe4-cdb91e5e3757')
            .expect(200);
    })
    it('should get ChargingStations', async() => {
        mockedChargingStationService.getChargingStations = jest.fn();
        await request(app.getHttpServer())
            .get('/charging-stations')
            .query({
                pageNumber: 1,
                pageSize: 3,
                name: 'ch'
            })
            .expect(200);
    })

    it('should update ChargingStation', async() => {
        mockedChargingStationService.updateChargingStation = jest.fn();
        await request(app.getHttpServer())
            .patch('/charging-stations/a23c0344-009b-4300-abe4-cdb91e5e3757')
            .send({
                name: 'charging-station_1'
            })
            .expect(200);
    })
    it('should replace Connector', async() => {
        mockedChargingStationService.replaceConnector = jest.fn();
        await request(app.getHttpServer())
            .patch('/charging-stations/connectors/a23c0344-009b-4300-abe4-cdb91e5e3757')
            .send({
                newConnectorId: '98951a26-21db-4585-ad69-082757161321'
            })
            .expect(200);
    })

    it('should delete ChargingStation', async() => {
        mockedChargingStationService.deleteChargingStation = jest.fn();
        await request(app.getHttpServer())
            .delete('/charging-stations/c23c0344-009b-4300-abe4-cdb91e5e3757')
            .expect(204);
    })
})