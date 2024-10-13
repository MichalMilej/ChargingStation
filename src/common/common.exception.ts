import { BadRequestException, ConflictException, Logger, NotFoundException } from "@nestjs/common";

export class CommonException {
    static notFoundException(logger: Logger, entity: string, param: string, value: any) {
        const message = `${entity} with ${param} '${value}' not found`;
        logger.log(message);
        throw new NotFoundException(message);
    }

    static alreadyInDatabaseException(logger: Logger, entity: string, param: string, value: any) {
        const message = `${entity} with ${param} '${value}' already exists in database`;
        logger.log(message);
        throw new ConflictException(message);
    }

    static conflictException(logger: Logger, message: string) {
        logger.log(message);
        throw new ConflictException(message);
    }

    static badRequestException(logger: Logger, message: string) {
        logger.log(message);
        throw new BadRequestException(message);
    }
}