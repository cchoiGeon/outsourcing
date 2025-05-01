import { Controller, Post, Body, Get, UseGuards, Req, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { GetUser } from 'src/common/deco/get-user.deco';
import { JwtAuthGuard } from '../jwt/jwt-auth.guard';
import { RoleGuard } from 'src/common/guard/role.guard';

@Controller('user')
@UseGuards(JwtAuthGuard, RoleGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}


  // @Post('profile/store-owner')
  // @CheckRole(Role.STORE_OWNER)
  // @UseInterceptors(FileInterceptor('file'))
  // async createStoreOwnerProfile(
  //   @GetUser() user,
  //   @Body() dto: StoreOwnerProfileDto,
  //   @UploadedFile(
  //     new ParseFilePipe({
  //       validators: [
  //         new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB 제한
  //         new FileTypeValidator({ fileType: /image\/(jpg|jpeg|png)/ }), // ✅ jpg, jpeg, png 허용
  //       ],
  //     }),
  //   )
  //   file: Express.Multer.File,
  // ) {
  //   return await this.userService.createStoreOwnerProfile(user.uuid, dto, file);
  // }

  @Get('profile')
  async getProfileStatus(@GetUser() user) {
    return await this.userService.getProfileStatus(user.uuid);
  }
}
