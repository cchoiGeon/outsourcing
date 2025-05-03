import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../../database/users.entity'; 
import { CustomerSignUpDto, StoreOwnerSignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';
import { Role } from 'src/common/enum/role.enum';
import { Store } from 'src/database/store.entity';
import { Category } from 'src/database/category.entity';
import { StoreOwnerProfile } from 'src/database/store-owner-profile.entity';
import { AwsService } from '../aws/aws.service';
import { VerificationStatus } from 'src/common/enum/status.enum';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
    @InjectRepository(StoreOwnerProfile)
    private readonly storeOwnerProfileRepository: Repository<StoreOwnerProfile>,
    private readonly awsService: AwsService,
  ) {}

  async signUpCustomer(signUpDto: CustomerSignUpDto): Promise<{ accessToken: string }> {
    const { email, password, name, phoneNumber, university } = signUpDto;

    // 이메일 중복 체크
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('이미 존재하는 이메일입니다.');
    }

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10);

    // 사용자 생성
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      role: Role.CUSTOMER,
      name,
      phoneNumber,
      university,
    });

    await this.userRepository.save(user);

    // JWT 토큰 생성
    const accessToken = this.jwtService.sign({ uuid: user.uuid, role: user.isAdmin ? 'ADMIN' :user.role, admin: user.isAdmin });

    return { accessToken };
  }

  async signUpStoreOwner(signUpDto: StoreOwnerSignUpDto, file?: Express.Multer.File): Promise<{ accessToken: string }> {
    const { name, email, password, phoneNumber, store } = signUpDto;

    // 이메일 중복 체크
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('이미 존재하는 이메일입니다.');
    }

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10);

    // 사용자 생성
    const user = this.userRepository.create({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
      role: Role.STORE_OWNER,
    });
    
    const [ verificationPhoto ] = await this.awsService.uploadImagesToS3(file, 'jpg');

    const userStore = this.storeRepository.create({
      name: store.storeName,
      address: store.storeAddress,
      phoneNumber: store.storePhoneNumber,
      storeInfo: store.storeInfo,
      storePickupTime: store.storePickupTime,
      lat: 32.5464809,
      lng: 126.8512888,
      category: { id: store.storeCategory } as Category,
      verificationPhoto: verificationPhoto,
      verificationStatus: VerificationStatus.PENDING,
    });

    const storeOwnerProfile = this.storeOwnerProfileRepository.create({
      user: user,
      store: userStore,
    });

    await this.userRepository.save(user);
    await this.storeRepository.save(userStore);
    await this.storeOwnerProfileRepository.save(storeOwnerProfile);
    // JWT 토큰 생성
    const accessToken = this.jwtService.sign({ uuid: user.uuid, role: user.isAdmin ? 'ADMIN' :user.role, admin: user.isAdmin  });

    return { accessToken };
  }

  async signIn(signInDto: SignInDto): Promise<{ accessToken: string }> {
    const { email, password } = signInDto;

    // 사용자 찾기
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('이메일 또는 비밀번호가 일치하지 않습니다.');
    }

    // 비밀번호 검증
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('이메일 또는 비밀번호가 일치하지 않습니다.');
    }
    
    // JWT 토큰 생성
    const accessToken = this.jwtService.sign({ uuid: user.uuid, role: user.isAdmin ? 'ADMIN' :user.role, admin: user.isAdmin });

    return { accessToken };
  }
}
