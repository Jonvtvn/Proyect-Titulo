import { IsString } from "class-validator"

export class CreateAccountDto {
	@IsString()
	idAccount?: string;
	@IsString()
	email: string;
	@IsString()
	password: string;
}