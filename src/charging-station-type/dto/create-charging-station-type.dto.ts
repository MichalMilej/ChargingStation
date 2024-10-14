import { ApiProperty } from "@nestjs/swagger";
import { CurrentType } from "@prisma/client";
import { IsEnum, IsInt, IsNotEmpty, IsPositive, IsString } from "class-validator";

export class CreateChargingStationTypeDto {
    @IsString()
    @IsNotEmpty()
    readonly name: string;
    
    @IsInt()
    @IsPositive()
    readonly plugCount: number;

    @IsPositive()
    readonly efficiency: number;

    @ApiProperty({ enum: ['AC', 'DC'] })
    @IsEnum(CurrentType)
    readonly currentType: CurrentType;
}