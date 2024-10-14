import { BadRequestException } from "@nestjs/common";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsOptional, IsUUID } from "class-validator";
import { PaginationDto } from "src/common/pagination.dto";

export class ConnectorQueryDto extends PaginationDto {

    @IsOptional()
    @IsNotEmpty()
    readonly name?: string;

    @IsOptional()
    @Transform(priority => {
        const value = priority.value;
        if (value !== 'true' && value !== 'false') {
            throw new BadRequestException(`Priority has to be either 'true' or 'false'`);
        }
        return value === 'true' ? true : false;
    })
    
    readonly priority?: boolean;

    @IsOptional()
    @IsUUID()
    readonly chargingStationId?: string;
}