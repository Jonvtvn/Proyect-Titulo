import { IsString } from "class-validator"

export class DeleteBarberDto {
	@IsString()
	id: string;
}