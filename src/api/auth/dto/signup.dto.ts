import { IsEmail, IsString, MinLength, IsEnum } from 'class-validator';
import { Role } from 'src/common/enum/role.enum';

export class SignUpDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(Role)
  role: Role;
} 
