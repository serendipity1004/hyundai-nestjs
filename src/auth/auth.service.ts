import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { UserProfileEntity } from 'src/users/entities/user-profile.entity';
import { JwtService } from '@nestjs/jwt';
import { AccessTokenPayload } from './types/access-token-payload.type';
import { LoginDto } from './dto/login.dto';
import { basename, join } from 'path';
import { promises as fs } from 'fs';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(UserProfileEntity)
        private readonly userProfileRepository: Repository<UserProfileEntity>,
        private readonly dataSource: DataSource,
        private readonly jwtService: JwtService,
    ) { }

    // Basic {token}
    validateBasicToken(header: string) {
        const [scheme, encoded] = header.split(' ');

        if (scheme !== 'Basic' || !encoded) {
            throw new UnauthorizedException('Basic 인증 스킴이 아닙니다!');
        }

        // username:password
        const credentials = this.decodeBase64(encoded);
        const [username, password] = credentials.split(':');

        if (!username || !password) {
            throw new UnauthorizedException('username 또는 password가 잘못됐습니다!');
        }

        return {
            email: username,
            password,
        }
    }

    decodeBase64(encoded: string) {
        try {
            const buffer = Buffer.from(encoded, 'base64');
            return buffer.toString('utf-8');
        } catch (e) {
            throw new UnauthorizedException('Base64 인코딩 실패');
        }
    }

    hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, 10);
    }

    comparePasswordAndHash(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }

    async register(registerDto: RegisterDto) {
        const hashedPassword = await this.hashPassword(registerDto.password);

        let newPath;

        if (registerDto.profileImage) {
            const fileName = basename(registerDto.profileImage);
            newPath = join('uploads', 'profileImage', fileName);

            try {
                await fs.rename(
                    join(process.cwd(), registerDto.profileImage),
                    join(process.cwd(), newPath)
                )
            } catch (e) {
                throw new BadRequestException('프로필 이미지를 다시 업로드 해주세요!')
            }
        }

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const user = this.userRepository.create({
                ...registerDto,
                password: hashedPassword,
            });

            await queryRunner.manager.save(user);

            const profile = this.userProfileRepository.create({
                user: user,
                bio: registerDto.bio,
                profileImage: newPath,
            });

            await queryRunner.manager.save(profile);

            await queryRunner.commitTransaction();

            return await this.userRepository.findOneBy({
                email: user.email,
            })
        } catch (e) {
            console.log(e);

            await queryRunner.rollbackTransaction();

            if (e.code === '23505') {
                if (e.detail.includes('(email)=')) {
                    throw new BadRequestException('이미 가입한 이메일 입니다!');
                }
                throw new BadRequestException('중복 에러가 발생했습니다!');
            }

            throw new InternalServerErrorException();
        } finally {
            await queryRunner.release();
        }
    }

    async issueToken(payload: AccessTokenPayload,
        type: 'access' | 'refresh' = 'access'
    ) {
        const accessToken = await this.jwtService.signAsync(
            payload,
            {
                expiresIn: '1h',
            }
        );
        const refreshToken = await this.jwtService.signAsync(
            payload,
            {
                expiresIn: '1d',
            }
        );

        return {
            refreshToken,
            accessToken
        }
    }

    async loginUser(loginDto: LoginDto) {
        const user = await this.userRepository.findOneBy({
            email: loginDto.email,
        });

        if (!user) {
            throw new UnauthorizedException('존재하지 않는 사용자입니다!');
        }

        const isPassValid = await this.comparePasswordAndHash(
            loginDto.password,
            user.password,
        );

        if (!isPassValid) {
            throw new UnauthorizedException('비밀번호가 잘못됐습니다.');
        }

        return this.issueToken({
            id: user.id,
            email: user.email,
            role: user.role as 'user' | 'admin',
        })
    }
}
