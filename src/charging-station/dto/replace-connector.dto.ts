import { IsUUID } from "class-validator";

export class ReplaceConnectorDto {
    
    @IsUUID()
    newConnectorId: string;
}