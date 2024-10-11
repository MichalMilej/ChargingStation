import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class CreateConnectorDto {

    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @IsBoolean()
    readonly priority: boolean;
}
