import { ApiProperty } from "@nestjs/swagger";
import { CurrentType } from "@prisma/client";
import { Type } from "class-transformer";
import { IsEnum, IsNotEmpty, IsOptional, IsPositive } from "class-validator";
import { PaginationDto } from "../../common/pagination.dto";

export class ChargingStationTypeQueryDto extends PaginationDto {

    @IsOptional()
    @IsNotEmpty()
    readonly name?: string;

    @IsOptional()
    @Type(() => Number)
    @IsPositive()
    readonly plugCount?: number;

    @IsOptional()
    @ApiProperty({ enum: ['AC', 'DC'] })
    @IsEnum(CurrentType)
    readonly currentType?: CurrentType;
}