import { ApiProperty } from "@nestjs/swagger";
import { CurrentType } from "@prisma/client";
import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

export class UpdateChargingStationTypeDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    readonly name?: string;
    
    @IsOptional()
    @IsInt()
    @IsPositive()
    readonly plugCount?: number;

    @IsOptional()
    @IsPositive()
    readonly efficiency?: number;

    @IsOptional()
    @ApiProperty({ enum: ['AC', 'DC'] })
    @IsEnum(CurrentType)
    readonly currentType?: CurrentType;
}