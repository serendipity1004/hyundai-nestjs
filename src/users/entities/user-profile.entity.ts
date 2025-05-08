import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./user.entity";

@Entity('user_profile')
export class UserProfileEntity {
    @PrimaryColumn()
    userId: number;

    @OneToOne(()=> UserEntity, (user) => user.profile, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({
        name: 'userId',
    })
    user: UserEntity;

    @Column()
    bio: string;

    @CreateDateColumn()
    createdAt: Date;
}