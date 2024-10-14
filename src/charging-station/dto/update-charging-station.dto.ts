import { IsArray, IsIP, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class UpdateChargingStationDto {
    
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    readonly name?: string;

    @IsOptional()
    @IsUUID()
    readonly deviceId?: string;

    @IsOptional()
    @IsIP()
    readonly ipAddress?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    readonly firmwareVersion?: string;

    @IsOptional()
    @IsUUID()
    readonly chargingStationTypeId?: string;

    @IsOptional()
    @IsArray()
    @IsUUID("all", {each: true})
    readonly connectorIds: string[];
}