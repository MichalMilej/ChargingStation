import { CurrentType } from "@prisma/client";
import { Type } from "class-transformer";
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

export class ChargingStationTypeFilterDto {

    @IsOptional()
    @IsNotEmpty()
    readonly name: string;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    readonly plugCount: number;

    @IsOptional()
    @IsEnum(CurrentType)
    readonly currentType: CurrentType;
}