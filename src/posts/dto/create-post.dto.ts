import { ArrayMaxSize, ArrayNotEmpty, IsArray, IsNotEmpty, IsNumber, IsString, Length } from "class-validator";
import { IsNull } from "typeorm";

export class CreatePostDto {
    @IsString({
        message: 'title은 문자열을 입력해주세요!',
    })
    @IsNotEmpty({
        message: 'title을 입력해주세요'
    })
    @Length(3, 20, {
        message: 'title은 3자 이상, 10자 이하여야합니다',
    })
    title: string;

    @IsString({
        message: 'content는 문자열을 입력해주세요!',
    })
    @IsNotEmpty({
        message: 'content를 입력해주세요'
    })
    content: string;

    @IsArray()
    @ArrayNotEmpty()
    @IsString({
        each: true,
    })
    @ArrayMaxSize(3)
    tags: string[];
}
