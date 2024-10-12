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

    @IsEnum(CurrentType)
    readonly currentType: CurrentType;
}