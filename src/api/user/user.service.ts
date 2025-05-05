import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../database/users.entity';
import { ProfileResponseDto } from './dto/profile-response.dto';
import { UpdatePasswordDto, UpdateUserDto } from './dto/update-profile.dto';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

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
      university: user.university,
      isAdmin: user.isAdmin,
    };
  }

  async updateProfile(uuid: string, dto: UpdateUserDto): Promise<void> {
    const user = await this.userRepository.findOne({ where: { uuid: uuid } });
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    user.name = dto.name || user.name;
    user.phoneNumber = dto.phoneNumber || user.phoneNumber;
    user.university = dto.university || user.university;

    await this.userRepository.save(user);
  }

  async updatePassword(uuid: string, dto: UpdatePasswordDto): Promise<void> {
    const user = await this.userRepository.findOne({ where: { uuid: uuid } });
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    // 기존 비밀번호 확인
    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('현재 비밀번호가 일치하지 않습니다.');
    }

    // 새로운 비밀번호 해시화
    const hashedNewPassword = await bcrypt.hash(dto.newPassword, 10);
    user.password = hashedNewPassword;

    await this.userRepository.save(user);
  }
}
