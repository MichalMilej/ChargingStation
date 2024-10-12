import { PaginationDto } from "./pagination.dto";

export class CommonPagination {
    static paginate(data: object, pagination: Pagination) {
        return {
            data: data,
            pagination: {
                pageNumber: pagination.pageNumber,
                pageSize: pagination.pageSize,
                totalPages: pagination.totalPages,
                totalSize: pagination.totalSize
            }
        }
    }
}

export class Pagination {
    readonly pageNumber: number;
    readonly pageSize: number;
    readonly totalPages: number;
    readonly totalSize: number;

    constructor(
        paginationDto: PaginationDto, 
        totalSize: number) {
            this.pageNumber = paginationDto.pageNumber;
            this.pageSize = paginationDto.pageSize;
            this.totalSize = totalSize;
            this.totalPages = Math.ceil(totalSize / this.pageSize);
        }
}