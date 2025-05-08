import { UserEntity } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

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

    @CreateDateColumn()
    createdDate: Date;
}
