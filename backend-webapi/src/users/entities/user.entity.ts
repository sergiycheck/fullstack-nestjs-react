import { BaseEntity } from 'src/entities/base-entities';
import { Group } from 'src/group/entities/group.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  username: string;

  @CreateDateColumn()
  created: Date;

  @Column({ default: '' })
  groupName: string;

  @ManyToOne(() => Group, (group) => group.users, {
    cascade: ['update'],
    onDelete: 'SET NULL',
  })
  group: Group;
}
