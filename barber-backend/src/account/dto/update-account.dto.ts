import { IsString } from "class-validator"

export class UpdateAccountDto {
	@IsString()
	idAccount: string;
	@IsString()
	email?: string;
	@IsString()
	password?: string;
}