import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostEntity } from './entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
  ){}

  create(createPostDto: CreatePostDto) {
    const post = this.postRepository.create(createPostDto);

    return this.postRepository.save(post);
  }

  findAll() {
    return this.postRepository.find();
  }

  async findOne(id: number) {
    const post = await this.postRepository.findOneBy({
      id
    });

    if (!post) {
      throw new NotFoundException(`ID: ${id}의 포스트가 존재하지 않습니다!`);
    }

    return post;
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    // const post = await this.findOne(id);

    // await this.postRepository.update(id, updatePostDto);

    // return this.findOne(id);

    const post = await this.findOne(id);

    const updated = this.postRepository.merge(
      post,
      updatePostDto,
    );

    return this.postRepository.save(updated);
  }

  async remove(id: number) {
    const post = await this.findOne(id);

    await this.postRepository.delete(id);

    return id;
  }
}
