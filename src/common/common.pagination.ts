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
    readonly totalPages: number;

    constructor(
        public readonly pageNumber: number, 
        public readonly pageSize: number, 
        public readonly totalSize: number) {
            this.totalPages = Math.ceil(totalSize / pageSize);
        }
}