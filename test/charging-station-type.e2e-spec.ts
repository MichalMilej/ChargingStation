import { INestApplication, ValidationPipe } from "@nestjs/common"
import { Test, TestingModule } from "@nestjs/testing"
import { ChargingStationTypeService } from "../src/charging-station-type/charging-station-type.service";
import * as request from 'supertest';
import { AppModule } from "../src/app.module";
import { AuthGuard } from "../src/auth/auth.guard";
import { AuthMockGuard } from "./auth.mock.guard";
import { CurrentType } from "@prisma/client";

describe('ChargingStationTypeController (e2e)', () => {
    let app: INestApplication;
    let mockedChargingStationTypeService: ChargingStationTypeService;

    beforeAll(async() => {
        const moduleRef: TestingModule = await Test.createTestingModule({
            imports: [AppModule]
        })
        .overrideProvider(AuthGuard)
        .useClass(AuthMockGuard)
        .compile();

        app = moduleRef.createNestApplication();
        mockedChargingStationTypeService = moduleRef.get(ChargingStationTypeService);

        app.useGlobalPipes(new ValidationPipe({
            transform: true,
            whitelist: true,
            forbidNonWhitelisted: true
        }));
        await app.init();
    })

    it ('should create ChargingStationType', async() => {
        mockedChargingStationTypeService.createChargingStationType = jest.fn().mockResolvedValue({});
        await request(app.getHttpServer())
            .post('/charging-station-types')
            .send({
                name: 'small',
                plugCount: 2,
                efficiency: 20,
                currentType: CurrentType.DC
            })
            .expect(201);
    })

    it('should get ChargingStationType by id', async() => {
        mockedChargingStationTypeService.getChargingStationTypeById = jest.fn();
        await request(app.getHttpServer())
            .get('/charging-station-types/06995c3f-9150-4c7d-bd89-279dfa41c09e')
            .expect(200);
    })
    it('should get ChargingStationType by name', async() => {
        mockedChargingStationTypeService.getChargingStationTypeByName = jest.fn();
        await request(app.getHttpServer())
            .get('/charging-station-types/name/small')
            .expect(200);
    })
    it('should get ChargingStationTypes', async() => {
        mockedChargingStationTypeService.getChargingStationTypes = jest.fn();
        await request(app.getHttpServer())
            .get('/charging-station-types')
            .query({
                pageNumber: 1,
                pageSize: 5
            })
            .expect(200);
    })

    it ('should update ChargingStationType', async() => {
        mockedChargingStationTypeService.updateChargingStationType = jest.fn();
        await request(app.getHttpServer())
            .patch('/charging-station-types/06995c3f-9150-4c7d-bd89-279dfa41c09e')
            .send({
                name: 'new-name'
            })
            .expect(200);
    })

    it ('should delete ChargingStationType', async() => {
        mockedChargingStationTypeService.deleteChargingStationType = jest.fn();
        await request(app.getHttpServer())
            .delete('/charging-station-types/06995c3f-9150-4c7d-bd89-279dfa41c09e')
            .expect(204);
    })
})