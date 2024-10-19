# ChargingStation
E-mobility charging station project in TypeScript.

1. Configuration variables are stored in .env file.

2. You can run application fully in Docker. All you need is to have it installed and run the following commend in the CLI, while being in the current directory.

```
docker-compose --profile full_docker up
```

You can also use Docker partially (only container with database). In this case you also need Node.js. First set .env variable DB_HOST="localhost". Then apply following commands, while being in the current directory to run the app.

```
docker-compose up
npm install
npm run build
npx prisma migrate dev
npm run start:dev
```

3. Successfully started application exposes API documentation at default URL 'http://localhost:3000/api'. If you modified .env variable APP_PORT replace number 3000 with that value.

4. To access API you need to get JWT from /auth endpoint. Send POST request with password=AUTHORIZATION_PASSWORD in body to acquire it.
Specific restrictions:
- Creating ChargingStation require listing all its connectors by id
- Updating chargingStationTypeId in ChargingStation require listing all its new connectors, even if part of them is the same
- Updating plugCount in ChargingStationType possible if it is not bound to any ChargingStation
- Updating chargingStationId in Connector only possible via accessing ChargingStation
- Updating priority in Connector to true only possible if it is not bound to ChargingStation or ChargingStation hasn't got any Connector with true priority
- Deleting ChargingStationType and Connector only possible if they are not bound to any ChargingStation
