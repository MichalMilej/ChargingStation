import { CurrentType } from "@prisma/client";
import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsPositive } from "class-validator";

export class CreateChargingStationTypeDto {
    @IsNotEmpty()
    name: string;
    
    @IsInt()
    @IsPositive()
    plugCount: number;

    @IsNumber()
    efficiency: number;

    @IsEnum(CurrentType)
    currentType: CurrentType;
}