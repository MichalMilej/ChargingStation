import { CurrentType } from "@prisma/client";
import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive } from "class-validator";

export class UpdateChargingStationTypeDto {
    @IsOptional()
    @IsNotEmpty()
    name: string;
    
    @IsOptional()
    @IsInt()
    @IsPositive()
    plugCount: number;

    @IsOptional()
    @IsNumber()
    efficiency: number;

    @IsOptional()
    @IsEnum(CurrentType)
    currentType: CurrentType;
}