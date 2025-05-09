import { Body, Controller, Post, Headers, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { BasicTokenGuard } from './guard/basic-token.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @UseGuards(BasicTokenGuard)
  async login(@Body() loginDto: LoginDto, @Request() request) {
    return this.authService.loginUser(
      request.credentials as {email: string, password: string}
    );
  }
}
