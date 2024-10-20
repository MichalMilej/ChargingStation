import { INestApplication, ValidationPipe } from "@nestjs/common"
import { Test, TestingModule } from "@nestjs/testing"
import * as request from 'supertest';
import { AppModule } from "../src/app.module";
import { AuthGuard } from "../src/auth/auth.guard";
import { AuthMockGuard } from "./auth.mock.guard";
import { ConnectorService } from "../src/connector/connector.service";

describe('ConnectorController (e2e)', () => {
    let app: INestApplication;
    let mockedConnectorService: ConnectorService;

    beforeAll(async() => {
        const moduleRef: TestingModule = await Test.createTestingModule({
            imports: [AppModule]
        })
        .overrideProvider(AuthGuard)
        .useClass(AuthMockGuard)
        .compile();

        app = moduleRef.createNestApplication();
        mockedConnectorService = moduleRef.get(ConnectorService);

        app.useGlobalPipes(new ValidationPipe({
            transform: true,
            whitelist: true,
            forbidNonWhitelisted: true
        }));
        await app.init();
    })

    it('should create Connector', async() => {
        mockedConnectorService.createConnector = jest.fn();
        await request(app.getHttpServer())
            .post('/connectors')
            .send({
                name: 'con1',
                priority: false
            })
            .expect(201);
    })
    it('should get Connector by id', async() => {
        mockedConnectorService.getConnectorById = jest.fn();
        await request(app.getHttpServer())
            .get('/connectors/59ffc537-5f78-4df9-b08d-7d348b8f281b')
            .expect(200);
    })
    it('should get Connectors', async() => {
        mockedConnectorService.getConnectors = jest.fn();
        await request(app.getHttpServer())
            .get('/connectors')
            .expect(200);
    })
    it('should update Connector', async() => {
        mockedConnectorService.updateConnector = jest.fn();
        await request(app.getHttpServer())
            .patch('/connectors/59ffc537-5f78-4df9-b08d-7d348b8f281b')
            .send({
                priority: true
            })
            .expect(200);
    })
    it('should delete Connector', async() => {
        mockedConnectorService.deleteConnector = jest.fn();
        await request(app.getHttpServer())
            .delete('/connectors/59ffc537-5f78-4df9-b08d-7d348b8f281b')
            .expect(204);
    })
})