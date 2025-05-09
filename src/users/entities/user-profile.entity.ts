import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./user.entity";
import { Transform } from "class-transformer";

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

    @Column({
        nullable: true,
    })
    @Transform(({value})=>{
        if(!value) return null;

        return `http://localhost:3000/${value}`;
    })
    profileImage?: string;

    @CreateDateColumn()
    createdAt: Date;
}