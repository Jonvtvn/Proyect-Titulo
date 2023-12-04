import {IsString } from "class-validator"
export class UpdateServiceDto{
    @IsString()
	idService:string;
	@IsString()
	name?: string
	@IsString()
	price?: string;
}