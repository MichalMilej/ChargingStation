export class CommonPagination {
    static paginate(data: object, pagination: Pagination) {
        return {
            data: data,
            pagination: pagination
        }
    }

    static countTotalPages(totalSize: number, pageSize: number): number {
        return Math.ceil(totalSize / pageSize);
    }
}

export class Pagination {
    constructor(
        public readonly pageNumber: number, 
        public readonly pageSize: number, 
        public readonly totalPages: number) {}
}