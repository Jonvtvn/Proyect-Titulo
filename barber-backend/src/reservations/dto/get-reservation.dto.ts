import { IsString } from "class-validator";
export class GetReservationDto {
    @IsString()
    id:string
}