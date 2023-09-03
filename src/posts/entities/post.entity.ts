import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';

@Entity('posts')
export class PostEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  filePath: string;

  @Column()
  description: string;

  @ManyToOne(() => UserEntity, (user: UserEntity) => user.posts, {
    onDelete: 'CASCADE',
  })
  user: UserEntity;
}
