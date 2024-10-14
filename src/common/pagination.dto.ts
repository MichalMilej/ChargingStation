import { Type } from "class-transformer";
import { IsNumber, IsPositive } from "class-validator";

export class PaginationDto {

    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    pageNumber: number = 1;

    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    pageSize: number = 5;
}