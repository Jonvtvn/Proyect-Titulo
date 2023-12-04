import { IsString } from "class-validator"

export class GetBarberDto {
	@IsString()
	id: string;
}