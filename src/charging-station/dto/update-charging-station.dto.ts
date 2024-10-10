import { IsIP, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class UpdateChargingStationDto {
    
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsOptional()
    @IsUUID()
    deviceId: string;

    @IsOptional()
    @IsIP()
    ipAddress: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    firmwareVersion: string;

    @IsOptional()
    @IsUUID()
    chargingStationTypeId: string;
}