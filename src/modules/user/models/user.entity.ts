import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty } from 'class-validator';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    comment: 'nickname',
    default: '',
  })
  @IsNotEmpty()
  name: string;

  @Column({
    comment: 'description',
    default: '',
  })
  desc: string;

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

  // @Column({
  //   comment: 'password',
  //   nullable: true,
  // })
  // password: string;

  // @Column({
  //   comment: 'account',
  //   nullable: true,
  // })
  // account: string;

  @Column({
    comment: 'code',
    nullable: true,
  })
  code: string;

  @Column({
    comment: 'codeCreateTimeAt',
    nullable: true,
  })
  codeCreateTimeAt: Date;
}
