import { IsString } from "class-validator"

export class GetServiceDto {
	@IsString()
	idService: string;
}