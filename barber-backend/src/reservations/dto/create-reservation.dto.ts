import { IsArray, IsDate, IsString } from "class-validator"
import { Services } from "../type/reservations-services.type";
import { userData } from "../type/reservations-user-data.type";
export class CreateReservationDto {
	@IsString()
	idReservation?: string;
	@IsString()
	idBarber: string;
	@IsString()
	userData: userData;
	@IsDate()
	reservationTime: Date;
	@IsString()
	status?: string;
	@IsArray()
	selectedServices: Services;
}




