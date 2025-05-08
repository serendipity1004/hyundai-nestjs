import { Body, Controller, Get, Param, ParseIntPipe, Post } from "@nestjs/common";
import { CommentsService } from "./comments.service";
import { CreatePostCommentDto } from "./dto/create-comment.dto";

@Controller('posts/:pid/comments')
export class CommentsController {
    constructor(
        private readonly commentsService: CommentsService,
    ) {}

    @Post()
    create(@Param('pid', ParseIntPipe) postId: number, @Body() createPostCommentDto:CreatePostCommentDto){
        return this.commentsService.create(postId, createPostCommentDto)
    }

    @Get()
    findAll(@Param('pid', ParseIntPipe) postId: number){
        return this.commentsService.findAll(postId);
    }
}