import { IsString } from "class-validator";
export class DeleteContactDto {
    @IsString()
    id:string
}