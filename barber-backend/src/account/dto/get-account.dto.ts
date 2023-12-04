import { IsString } from "class-validator"

export class GetAccountDto {
	@IsString()
	idAccount: string;
}