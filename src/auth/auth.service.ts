import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
    ) { }

    hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, 10);
    }

    comparePasswordAndHash(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }

    async register(registerDto: RegisterDto) {
        try {
            const hashedPassword = await this.hashPassword(registerDto.password);

            const user = this.userRepository.create({
                ...registerDto,
                password: hashedPassword,
                profile: {
                    bio: registerDto.bio,
                }
            });

            await this.userRepository.save(user);

            return this.userRepository.findOneBy({
                email: registerDto.email,
            });
        } catch (e) {
            if (e.code === '23505') {
                if (e.detail.includes('(email)=')) {
                    throw new BadRequestException('이미 가입한 이메일 입니다!');
                }
                throw new BadRequestException('중복 에러가 발생했습니다!');
            }

            throw new InternalServerErrorException();
        }
    }
}
