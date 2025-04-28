import { Role } from "src/common/enum/role.enum";

export class ProfileResponseDto {
  name: string;
  email: string;
  phoneNumber: string;
  hasProfile: boolean;
  role: Role;
}