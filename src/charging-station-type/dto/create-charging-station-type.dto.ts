import { CurrentType } from "@prisma/client";
import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";

export class CreateChargingStationTypeDto {
    @IsString()
    @IsNotEmpty()
    name: string;
    
    @IsInt()
    @IsPositive()
    plugCount: number;

    @IsNumber()
    @IsPositive()
    efficiency: number;

    @IsEnum(CurrentType)
    currentType: CurrentType;
}