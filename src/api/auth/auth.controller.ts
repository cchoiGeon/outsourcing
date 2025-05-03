import { Controller, Post, Body, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CustomerSignUpDto, StoreOwnerSignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup/customer')
  async signUpCustomer(@Body() signUpDto: CustomerSignUpDto) {
    return await this.authService.signUpCustomer(signUpDto);
  }

  @Post('signup/store-owner')
  @UseInterceptors(FileInterceptor('file'))
  async signUpStoreOwner(@Body() signUpDto: StoreOwnerSignUpDto, @UploadedFile( 
    new ParseFilePipe({
      fileIsRequired: false,
      validators: [
        new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB 제한
        new FileTypeValidator({ fileType: /image\/(jpg|jpeg|png)/ }), // ✅ jpg, jpeg, png 허용
      ],
    }))
    file?: Express.Multer.File,
    ) {
    return await this.authService.signUpStoreOwner(signUpDto, file);
  }

  @Post('signin')
  async signIn(@Body() signInDto: SignInDto) {
    return await this.authService.signIn(signInDto);
  }
}
