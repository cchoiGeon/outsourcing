import { Controller, Post, Body, Get, UseGuards, Req, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, UseInterceptors, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { GetUser } from 'src/common/deco/get-user.deco';
import { JwtAuthGuard } from '../jwt/jwt-auth.guard';
import { RoleGuard } from 'src/common/guard/role.guard';
import { UpdatePasswordDto, UpdateUserDto } from './dto/update-profile.dto';

@Controller('user')
@UseGuards(JwtAuthGuard, RoleGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  async getProfileStatus(@GetUser() user) {
    return await this.userService.getProfileStatus(user.uuid);
  }
  @Patch('profile')
  async updateProfile(@GetUser() user, @Body() dto: UpdateUserDto) {
    return await this.userService.updateProfile(user.uuid, dto);
  }

  @Patch('password')
  async updatePassword(@GetUser() user, @Body() dto: UpdatePasswordDto) {
    return await this.userService.updatePassword(user.uuid, dto);
  }
}
