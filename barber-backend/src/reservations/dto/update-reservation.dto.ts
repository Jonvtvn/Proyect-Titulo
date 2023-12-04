import { IsArray, IsDateString, IsString } from "class-validator";
import { Services } from "../type/reservations-services.type";
export class UpdateReservationDto {
    @IsString()
    idReservation: string;
    @IsString()
    email?: string;
    @IsDateString()
    reservationTime?: Date
    @IsString()
    status?: string;
    @IsString()
    services?: Services;
}