import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreatePostCommentDto {
    @IsNumber()
    authorId: number;

    @IsString()
    @IsNotEmpty()
    content: string;
}