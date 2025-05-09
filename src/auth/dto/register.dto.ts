import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class RegisterDto{
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsNotEmpty()
    bio: string;

    @IsString()
    @IsOptional()
    profileImage?: string;
}