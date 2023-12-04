import { IsString } from "class-validator";
export class UpdateContactDto {
    @IsString()
    idContact:string;
    @IsString()
    user_name?: string;
    @IsString()
    user_email?: string;
    @IsString()
    message?: string;
}