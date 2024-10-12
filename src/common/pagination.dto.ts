import { Type } from "class-transformer";
import { IsNumber, IsPositive } from "class-validator";

export class PaginationDto {

    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    pageNumber: number;

    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    pageSize: number;
}