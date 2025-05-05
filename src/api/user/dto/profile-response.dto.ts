import { Role } from "src/common/enum/role.enum";

export class ProfileResponseDto {
  name: string;
  email: string;
  phoneNumber: string;
  role: Role;
  university: string;
  isAdmin: boolean;
}