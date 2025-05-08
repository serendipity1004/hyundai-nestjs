import { UserEntity } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { TagEntity } from "./tag.entity";
import { PostCommentEntity } from "src/post-comments/entities/post-comment.entity";

@Entity('post')
export class PostEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(()=> UserEntity, (user) => user.posts)
    author: UserEntity;

    @Column()
    title: string;

    @Column()
    content: string;

    @ManyToMany(()=> TagEntity, (tag) => tag.posts)
    @JoinTable()
    tags: TagEntity[];

    @OneToMany(()=> PostCommentEntity, (pc) => pc.post)
    postComments: PostCommentEntity[];

    @CreateDateColumn()
    createdDate: Date;
}
