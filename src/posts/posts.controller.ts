import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, BadRequestException, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AccessTokenGuard } from 'src/auth/guard/access-token.guard';
import { User } from 'src/auth/decorator/user.decorator';
import { AccessTokenPayload } from 'src/auth/types/access-token-payload.type';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(AccessTokenGuard)
  create(@Body() createPostDto: CreatePostDto, @User() user: AccessTokenPayload) {
    return this.postsService.create(createPostDto, user.id);
  }

  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  // [GET] /posts/:id
  @Get(':id')
  findOne(@Param('id', new ParseIntPipe({
    exceptionFactory: (error)=> new BadRequestException('ID를 숫자로 입력해주세요!'),
  })) id: number) {
    return this.postsService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AccessTokenGuard)
  update(@Param('id', ParseIntPipe) id: number, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(+id, updatePostDto);
  }

  @Delete(':id')
  @UseGuards(AccessTokenGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.remove(+id);
  }
}
