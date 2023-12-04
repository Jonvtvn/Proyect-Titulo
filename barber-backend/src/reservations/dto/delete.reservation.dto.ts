import { IsString } from "class-validator"

export class DeleteReservationDto {
	@IsString()
	id: string;
}