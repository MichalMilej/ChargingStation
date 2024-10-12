import { IsArray, IsIP, IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateChargingStationDto {

    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @IsUUID()
    readonly deviceId: string;

    @IsIP()
    readonly ipAddress: string;

    @IsString()
    @IsNotEmpty()
    readonly firmwareVersion: string;

    @IsUUID()
    readonly chargingStationTypeId: string;

    @IsArray()
    @IsUUID("all", {each: true})
    readonly connectorIds: string[];
}