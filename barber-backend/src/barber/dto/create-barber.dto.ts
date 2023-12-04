import { IsString, IsEmail, IsNotEmpty } from 'class-validator';
export class CreateBarberDto {
  @IsNotEmpty()
  @IsString()
  idBarber?: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @IsNotEmpty()
  profileImage?: string;
}
