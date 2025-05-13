import { Controller, Post, UseGuards, Body, Get, Param, UploadedFile, UseInterceptors, FileTypeValidator, MaxFileSizeValidator, ParseFilePipe, Patch, Delete } from '@nestjs/common';
import { JwtAuthGuard } from '../jwt/jwt-auth.guard';
import { RoleGuard } from 'src/common/guard/role.guard';
import { InventoryService } from './inventory.service';
import { CreateInventoryDto, UpdateInventoryDto } from './dto/create-inventory.dto';
import { Role } from 'src/common/enum/role.enum';
import { CheckRole } from 'src/common/deco/check-role.deco';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetUser } from 'src/common/deco/get-user.deco';
@Controller('inventory')
@UseGuards(JwtAuthGuard, RoleGuard)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}
  
  @Delete('/:inventId')
  @CheckRole(Role.STORE_OWNER)
  async deleteInventory(@Param('inventId') inventId: number, @GetUser() user) {
    return await this.inventoryService.deleteInventory(inventId, user.uuid);
  }

  @Patch(':inventId')
  @CheckRole(Role.STORE_OWNER)
  async updateInventory(@Param('inventId') inventId: number, @Body() dto: UpdateInventoryDto, @GetUser() user) {
    return await this.inventoryService.updateInventory(inventId, dto, user.uuid);
  }

  @Post('/')
  @CheckRole(Role.STORE_OWNER)
  @UseInterceptors(FileInterceptor('file'))
  async createInventory(@Body() dto: CreateInventoryDto, @GetUser() user, @UploadedFile( 
    new ParseFilePipe({
      fileIsRequired: false,
      validators: [
        new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB 제한
        new FileTypeValidator({ fileType: /image\/(jpg|jpeg|png)/ }), // ✅ jpg, jpeg, png 허용
      ],
    }))
    file?: Express.Multer.File,
  ) {
    return await this.inventoryService.createInventory(user.uuid, dto, file);
  }

  @Get('/')
  async getTodayInventory(@GetUser() user) {
    return await this.inventoryService.getTodayInventory(user.uuid);
  }

  @Get('/:inventId')
  async getInventoryByInventId(@Param('inventId') inventId: number) {
    return await this.inventoryService.getInventoryByInventId(inventId);
  }
}
