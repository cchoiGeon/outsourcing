import { SetMetadata } from '@nestjs/common';
import { Role } from '../enum/role.enum';
import { ROLE_KEY } from '../guard/role.guard';

export const CheckRole = (role: Role) => SetMetadata(ROLE_KEY, role);