import {IsString } from "class-validator"
export class CreateServiceDto{
    @IsString()
	idService?:string;
	@IsString()
	name: string
	@IsString()
	price: string;
}