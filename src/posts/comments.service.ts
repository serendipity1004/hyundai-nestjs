import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PostCommentEntity } from "src/post-comments/entities/post-comment.entity";
import { Repository } from "typeorm";
import { CreatePostCommentDto } from "./dto/create-comment.dto";

@Injectable()
export class CommentsService {
    constructor(
        @InjectRepository(PostCommentEntity)
        private readonly commentsRepository: Repository<PostCommentEntity>
    ) { }

    async create(postId: number, createPostCommentDto: CreatePostCommentDto) {
        const comment = this.commentsRepository.create({
            ...createPostCommentDto,
            author: {
                id: createPostCommentDto.authorId,
            },
            post: {
                id: postId,
            }
        });

        return this.commentsRepository.save(comment);
    }

    async findAll(postId: number) {
        return this.commentsRepository.createQueryBuilder('comment')
            .leftJoinAndSelect('comment.author', 'author')
            .leftJoin('comment.post', 'post')
            .where('post.id = :pid', { pid: postId })
            .getMany();
    }
}