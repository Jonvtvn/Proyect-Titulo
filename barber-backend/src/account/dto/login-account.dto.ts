import { IsString } from "class-validator"

export class LoginAccountDto {
	@IsString()
	email: string;
	@IsString()
	password: string;
}