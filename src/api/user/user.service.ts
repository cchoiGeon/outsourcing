import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../database/users.entity';
import { ProfileResponseDto } from './dto/profile-response.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // async createStoreOwnerProfile(uuid: string, dto: StoreOwnerProfileDto, file: Express.Multer.File): Promise<void> {
  //   const user = await this.userRepository.findOne({ where: { uuid: uuid } });
  //   if (!user) {
  //     throw new NotFoundException('사용자를 찾을 수 없습니다.');
  //   }

  //   const category = await this.categoryRepository.findOne({ where: { categoryName: dto.storeCategory } });
  //   if (!category) {
  //     throw new NotFoundException('해당 카테고리를 찾을 수 없습니다.');
  //   }

  //   const [ verificationPhoto ] = await this.awsService.uploadImagesToS3(file, 'jpg');

  //   const store = this.storeRepository.create({
  //     name: dto.storeName,
  //     address: dto.storeAddress,
  //     category: category,
  //     phoneNumber: dto.storePhoneNumber,  
  //     verificationPhoto: verificationPhoto,
  //     verificationStatus: VerificationStatus.PENDING,
  //   });
  //   const savedStore = await this.storeRepository.save(store);

  //   const profile = this.storeOwnerProfileRepository.create({
  //     user: {
  //       uuid: uuid,
  //     },
  //     name: dto.name,
  //     phoneNumber: dto.phoneNumber,
  //     store: savedStore,
  //   });

  //   await this.storeOwnerProfileRepository.save(profile);
  // }

  async getProfileStatus(uuid: string): Promise<ProfileResponseDto> {
    const user = await this.userRepository.findOne({ where: { uuid: uuid } });
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    return {
      role: user.role,
      email: user.email,
      name: user.name,
      phoneNumber: user.phoneNumber,
    };
  }
}
