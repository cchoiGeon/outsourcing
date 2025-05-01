import { IsEmail, IsString, MinLength, IsEnum, IsNotEmpty } from 'class-validator';
import { Role } from 'src/common/enum/role.enum';

export class SignUpDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString() 
  @IsNotEmpty()
  phoneNumber: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(Role)
  role: Role;
} 
