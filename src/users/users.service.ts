import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) { }

  async create(createUserDto: CreateUserDto) {
    try {
      // 1) UserEntity 객체 생성
      const user = this.userRepository.create(createUserDto);

      // 2) 저장
      return await this.userRepository.save(user);
    } catch (e) {
      // 3) unique violation 에러가 날 경우
      //    이미 가입한 이메일 에러 반환
      if(e.code === '23505'){
        if(e.detail.includes('(email)=')){
          throw new BadRequestException('이미 가입한 이메일 입니다!');
        }
        throw new BadRequestException('중복 에러가 발생했습니다!');
      }

      throw new InternalServerErrorException();
    }
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
