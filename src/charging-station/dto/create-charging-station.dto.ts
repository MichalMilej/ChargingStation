import { IsIP, IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateChargingStationDto {

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsUUID()
    deviceId: string;

    @IsIP()
    ipAddress: string;

    @IsString()
    @IsNotEmpty()
    firmwareVersion: string;

    @IsUUID()
    chargingStationTypeId: string;
}