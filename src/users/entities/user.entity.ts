import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserProfileEntity } from "./user-profile.entity";
import { PostEntity } from "src/posts/entities/post.entity";
import { PostCommentEntity } from "src/post-comments/entities/post-comment.entity";
import { Exclude } from "class-transformer";

@Entity('user')
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        unique: true,
    })
    email: string;

    @Column()
    @Exclude()
    password: string;

    @Column({
        default: 'user',
    })
    role: string;

    @OneToOne(() => UserProfileEntity, (profile) => profile.user, {
        cascade: true,
        eager: true,
    })
    profile: UserProfileEntity;

    @OneToMany(() => PostEntity, (post) => post.author)
    posts: PostEntity[];

    @OneToMany(()=> PostCommentEntity, (pc) => pc.author)
    postComments: PostCommentEntity[];

    @CreateDateColumn()
    createdAt: Date;
}
