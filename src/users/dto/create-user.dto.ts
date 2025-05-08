import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

export class CreateUserDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @Length(3, 20)
    password: string;

    @IsString()
    @IsNotEmpty()
    bio: string;
}
