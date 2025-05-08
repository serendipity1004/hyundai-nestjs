import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from './entities/post.entity';
import { TagEntity } from './entities/tag.entity';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { PostCommentEntity } from 'src/post-comments/entities/post-comment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PostEntity,
      TagEntity,
      PostCommentEntity,
    ]),
  ],
  controllers: [
    PostsController,
    CommentsController,
  ],
  providers: [PostsService, CommentsService],
})
export class PostsModule {}
