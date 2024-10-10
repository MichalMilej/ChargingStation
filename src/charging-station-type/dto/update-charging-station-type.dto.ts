import { CurrentType } from "@prisma/client";
import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

export class UpdateChargingStationTypeDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    name: string;
    
    @IsOptional()
    @IsInt()
    @IsPositive()
    plugCount: number;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    efficiency: number;

    @IsOptional()
    @IsEnum(CurrentType)
    currentType: CurrentType;
}