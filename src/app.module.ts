import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from './posts/entities/post.entity';
import { UsersModule } from './users/users.module';
import { UserEntity } from './users/entities/user.entity';
import { UserProfileEntity } from './users/entities/user-profile.entity';

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
      ],
      synchronize: true,
    }),
    PostsModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
