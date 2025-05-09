import { BadRequestException, Inject, Injectable, InternalServerErrorException, LoggerService, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserProfileEntity } from './entities/user-profile.entity';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(UserProfileEntity)
    private readonly userProfileRepository: Repository<UserProfileEntity>,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) { }

  async create(createUserDto: CreateUserDto) {
    this.logger.log('사용자 생성 시도중', 'UserService/create');

    try {
      // 1) UserEntity 객체 생성
      const user = this.userRepository.create({
        ...createUserDto,
        profile: {
          bio: createUserDto.bio,
        },
      });

      await this.userRepository.save(user);

      return this.userRepository.findOneBy({
        email: user.email,
      })
    } catch (e) {
      this.logger.error('사용자 생성 실패', e.stackTrace, 'UserService/create');
      // 3) unique violation 에러가 날 경우
      //    이미 가입한 이메일 에러 반환
      if (e.code === '23505') {
        if (e.detail.includes('(email)=')) {
          throw new BadRequestException('이미 가입한 이메일 입니다!');
        }
        throw new BadRequestException('중복 에러가 발생했습니다!');
      }

      throw new InternalServerErrorException();
    }
  }

  findAll() {
    return this.userRepository.find();
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({
      where: {
        id,
      }
    });

    if (!user) {
      throw new NotFoundException('존재하지 않는 사용자입니다!');
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);

    const updated = this.userRepository.merge(user, {
      ...updateUserDto,
      profile: {
        ...(user.profile ?? {}),
        bio: updateUserDto.bio,
      }
    });

    return this.userRepository.save(updated);
  }

  async remove(id: number) {
    await this.findOne(id);

    await this.userRepository.delete(id);

    return id;
  }
}
