import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../database/users.entity';
import { UserProfile } from '../../database/user-profile.entity';
import { StoreOwnerProfile } from '../../database/store-owner-profile.entity';
import { Store } from '../../database/store.entity';
import { CustomerProfileDto } from './dto/customer-profile.dto';
import { StoreOwnerProfileDto } from './dto/store-owner-profile.dto';
import { ProfileResponseDto } from './dto/profile-response.dto';
import { Role } from '../../common/enum/role.enum';
import { VerificationStatus } from 'src/common/enum/status.enum';
import { AwsService } from '../aws/aws.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserProfile)
    private readonly userProfileRepository: Repository<UserProfile>,
    @InjectRepository(StoreOwnerProfile)
    private readonly storeOwnerProfileRepository: Repository<StoreOwnerProfile>,
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
    private readonly awsService: AwsService,
  ) {}

  async createCustomerProfile(uuid: string, dto: CustomerProfileDto): Promise<void> {
    const user = await this.userRepository.findOne({ where: { uuid: uuid } });
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    const profile = this.userProfileRepository.create({
      user: {
        uuid: uuid,
      },
      name: dto.name,
      phoneNumber: dto.phoneNumber,
    });

    await this.userProfileRepository.save(profile);
  }

  async createStoreOwnerProfile(uuid: string, dto: StoreOwnerProfileDto, file: Express.Multer.File): Promise<void> {
    const user = await this.userRepository.findOne({ where: { uuid: uuid } });
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    const [ verificationPhoto ] = await this.awsService.uploadImagesToS3(file, 'jpg');

    const store = this.storeRepository.create({
      name: dto.storeName,
      address: dto.storeAddress,
      category: dto.storeCategory,
      phoneNumber: dto.storePhoneNumber,  
      verificationPhoto: verificationPhoto,
      verificationStatus: VerificationStatus.PENDING,
    });
    const savedStore = await this.storeRepository.save(store);

    const profile = this.storeOwnerProfileRepository.create({
      user: {
        uuid: uuid,
      },
      name: dto.name,
      phoneNumber: dto.phoneNumber,
      store: savedStore,
    });

    await this.storeOwnerProfileRepository.save(profile);
  }

  async getProfileStatus(uuid: string): Promise<ProfileResponseDto> {
    const user = await this.userRepository.findOne({ where: { uuid: uuid } });
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    let hasProfile = false;
    let profile = null;

    if (user.role === Role.CUSTOMER) {
      profile = await this.userProfileRepository.findOne({ where: { user: { uuid: uuid } } });
      hasProfile = !!profile;
    } else if (user.role === Role.STORE_OWNER) {
      profile = await this.storeOwnerProfileRepository.findOne({ where: { user: { uuid: uuid } } });
      hasProfile = !!profile;
    }

    return {
      hasProfile,
      role: user.role,
      email: user.email ?? null,
      name: profile?.name ?? null,
      phoneNumber: profile?.phoneNumber ?? null,
    };
  }
}
