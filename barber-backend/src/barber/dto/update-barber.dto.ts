import { IsString } from "class-validator";
export class UpdateBarberDto{
    @IsString()
    idBarber:string;
    @IsString()
    name?:string;
    @IsString()
    email?:string;
    @IsString()
    phoneNumber?:string;
}