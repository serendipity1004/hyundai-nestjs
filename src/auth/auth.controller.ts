import { Body, Controller, Post, Headers, UseGuards, Request, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { BasicTokenGuard } from './guard/basic-token.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { v4 } from 'uuid';
import { ApiBadRequestResponse, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserEntity } from 'src/users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  @ApiOperation({
    summary: '회원가입',
    description: '이메일과 비밀번호로 회원가입을 진행!',
  })
  @ApiResponse({
    status: 201,
    description: '사용자 생성 성공',
    type: UserEntity,
  })
  @ApiBadRequestResponse({
    description: '이메일이 중복되거나 입력한 값이 잘못됐을때',
  })
  @ApiBearerAuth()
  async register(
    @Body() registerDto: RegisterDto,
  ) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @UseGuards(BasicTokenGuard)
  async login(@Body() loginDto: LoginDto, @Request() request) {
    return this.authService.loginUser(
      request.credentials as { email: string, password: string }
    );
  }
}
