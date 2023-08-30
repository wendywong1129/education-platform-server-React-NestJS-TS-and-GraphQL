import { IsInt, IsNotEmpty, Min } from 'class-validator';
import { CommonEntity } from '@/common/entities/common.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  JoinTable,
  ManyToMany,
} from 'typeorm';
import { ReducibleTimeType } from '../dto/common.type';
import { Organization } from '@/modules/organization/models/organization.entity';
import { Card } from '@/modules/card/models/card.entity';
import { Teacher } from '@/modules/teacher/models/teacher.entity';

/**
 * 组件
 */
@Entity('course')
export class Course extends CommonEntity {
  @Column({
    comment: 'course name',
  })
  @IsNotEmpty()
  name: string;

  @Column({
    comment: 'course description',
    nullable: true,
    type: 'text',
  })
  desc: string;

  @Column({
    comment: 'age group',
  })
  @IsNotEmpty()
  group: string;

  @Column({
    comment: 'base ability',
  })
  @IsNotEmpty()
  baseAbility: string;

  @Column({
    comment: 'limit number',
  })
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  limitNumber: number;

  @Column({
    comment: 'duration',
  })
  @IsNotEmpty()
  duration: number;

  @Column({
    comment: 'reservation info',
    nullable: true,
  })
  reserveInfo: string;

  @Column({
    comment: 'refund info',
    nullable: true,
  })
  refundInfo: string;

  @Column({
    comment: 'other info',
    nullable: true,
  })
  otherInfo: string;

  @Column({
    comment: 'cover image',
    nullable: true,
  })
  coverUrl: string;

  @Column('simple-json', {
    comment: 'available time',
    nullable: true,
  })
  reducibleTime: ReducibleTimeType[];

  @ManyToOne(() => Organization, (org) => org.courses, {
    cascade: true,
  })
  org: Organization;

  @OneToMany(() => Card, (org) => org.course)
  cards: Card;

  @ManyToMany(() => Teacher, { cascade: true })
  @JoinTable({
    name: 'course_teacher',
  })
  teachers: Teacher[];
}
