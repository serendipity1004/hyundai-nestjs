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
  ) { }

  async create(createPostDto: CreatePostDto) {
    const post = this.postRepository.create({
      ...createPostDto,
      author: {
        id: createPostDto.authorId,
      }
    });

    await this.postRepository.save(post);

    return this.findOne(post.id);
  }

  findAll() {
    return this.postRepository.createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .getMany();
  }

  async findOne(id: number) {
    const post = await this.postRepository.createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .where('post.id = :id', {id})
      .getOne();
    // const post = await this.postRepository.findOneBy({
    //   id
    // });

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

    await this.postRepository.save(updated);

    return this.findOne(post.id);
  }

  async remove(id: number) {
    const post = await this.findOne(id);

    await this.postRepository.delete(id);

    return id;
  }
}
