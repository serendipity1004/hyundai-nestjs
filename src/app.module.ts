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
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './logger/winston.config';
import { LoggerInterceptor } from './logger/interceptor/logger.interceptor';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ErrorExceptionFilter } from './common/filter/error.filter';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    WinstonModule.forRoot(winstonConfig),
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
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: ErrorExceptionFilter,
    }
  ],
})
export class AppModule {}
