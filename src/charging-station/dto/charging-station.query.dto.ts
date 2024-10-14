import { IsNotEmpty, IsOptional, IsUUID } from "class-validator";
import { PaginationDto } from "src/common/pagination.dto";

export class ChargingStationQueryDto extends PaginationDto {
   
    @IsOptional()
    @IsNotEmpty()
    name?: string;

    @IsOptional()
    @IsNotEmpty()
    ipAddress?: string;

    @IsOptional()
    @IsNotEmpty()
    firmwareVersion?: string;

    @IsOptional()
    @IsUUID()
    chargingStationTypeId?: string;
}