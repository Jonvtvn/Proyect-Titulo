import { IsString } from "class-validator"

export class DeleteServiceDto {
	@IsString()
	idService: string;
}