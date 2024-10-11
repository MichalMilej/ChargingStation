import { CurrentType } from "@prisma/client";
import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

export class UpdateChargingStationTypeDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    readonly name: string;
    
    @IsOptional()
    @IsInt()
    @IsPositive()
    readonly plugCount: number;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    readonly efficiency: number;

    @IsOptional()
    @IsEnum(CurrentType)
    readonly currentType: CurrentType;
}