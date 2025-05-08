import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from './posts/entities/post.entity';
import { UsersModule } from './users/users.module';
import { UserEntity } from './users/entities/user.entity';
import { UserProfileEntity } from './users/entities/user-profile.entity';
import { TagEntity } from './posts/entities/tag.entity';
import { PostCommentsModule } from './post-comments/post-comments.module';
import { PostCommentEntity } from './post-comments/entities/post-comment.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 3001,
      username: 'postgres',
      password: 'postgres',
      database: 'postgres',
      entities: [
        PostEntity,
        UserEntity,
        UserProfileEntity,
        TagEntity,
        PostCommentEntity,
      ],
      synchronize: true,
    }),
    PostsModule,
    UsersModule,
    PostCommentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
