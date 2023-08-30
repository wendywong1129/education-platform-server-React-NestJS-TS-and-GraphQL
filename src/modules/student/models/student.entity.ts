import { CommonEntity } from '@/common/entities/common.entity';
// import { IsNotEmpty } from 'class-validator';

import {
  Column,
  Entity,
  // PrimaryGeneratedColumn
} from 'typeorm';

@Entity('student')
export class Student extends CommonEntity {
  // @PrimaryGeneratedColumn('uuid')
  // id: string;

  @Column({
    comment: 'nickname',
    default: '',
  })
  // @IsNotEmpty()
  name: string;

  @Column({
    comment: 'mobile',
    nullable: true,
  })
  tel: string;

  @Column({
    comment: 'avatar',
    nullable: true,
  })
  avatar: string;

  @Column({
    comment: 'password',
  })
  password: string;

  @Column({
    comment: 'account',
  })
  account: string;

  @Column({
    comment: 'openid',
    nullable: true,
  })
  openid?: string;
}
