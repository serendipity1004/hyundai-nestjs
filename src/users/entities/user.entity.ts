import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('user')
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        unique: true,
    })
    email: string;

    @Column()
    password: string;

    @Column({
        default: 'user',
    })
    role: string;

    @CreateDateColumn()
    createdAt: Date;
}
