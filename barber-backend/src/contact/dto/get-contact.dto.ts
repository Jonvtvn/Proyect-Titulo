import { IsString } from "class-validator";
export class GetContactDto {
    @IsString()
    id:string
}