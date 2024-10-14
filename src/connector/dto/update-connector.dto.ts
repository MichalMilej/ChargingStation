import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateConnectorDto {

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    readonly name?: string;

    @IsOptional()
    @IsBoolean()
    readonly priority?: boolean;
}