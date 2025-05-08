import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostEntity } from './entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TagEntity } from './entities/tag.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
    @InjectRepository(TagEntity)
    private readonly tagRepository: Repository<TagEntity>,
  ) { }

  async create(createPostDto: CreatePostDto) {
    await this.tagRepository.upsert(
      createPostDto.tags.map((tag) => ({
        name: tag,
      })),
      ['name']
    )

    const tags = await this.tagRepository.find({
      where: createPostDto.tags.map((tag) => ({
        name: tag,
      })),
    })

    const post = this.postRepository.create({
      ...createPostDto,
      author: {
        id: createPostDto.authorId,
      },
      tags,
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
      .where('post.id = :id', { id })
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
    const post = await this.findOne(id);

    let tags = [] as TagEntity[];

    if (updatePostDto.tags && updatePostDto.tags.length > 0) {
      await this.tagRepository.upsert(
        updatePostDto.tags.map((tag) => ({
          name: tag,
        })),
        ['name']
      )

      tags = await this.tagRepository.find({
        where: updatePostDto.tags.map((tag) => ({ name: tag }))
      })
    }

    const updated = this.postRepository.merge({
      ...post,
      tags: [],
    }, {
      ...updatePostDto,
      tags,
    });

    await this.postRepository.save(updated);

    return this.findOne(id);

    // const post = await this.findOne(id);

    // await this.postRepository.update(id, updatePostDto);

    // return this.findOne(id);

    // const post = await this.findOne(id);

    // const updated = this.postRepository.merge(
    //   post,
    //   updatePostDto,
    // );

    // await this.postRepository.save(updated);

    // return this.findOne(post.id);
  }

  async remove(id: number) {
    const post = await this.findOne(id);

    await this.postRepository.delete(id);

    return id;
  }
}
