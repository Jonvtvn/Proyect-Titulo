import { IsString } from "class-validator"
export class CreateContactDto {
    @IsString()
    idContact?:string;
    @IsString()
    user_name: string;
    @IsString()
    user_email: string;
    @IsString()
    message: string;
}