import { UserEntity } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { TagEntity } from "./tag.entity";

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

    @CreateDateColumn()
    createdDate: Date;
}
