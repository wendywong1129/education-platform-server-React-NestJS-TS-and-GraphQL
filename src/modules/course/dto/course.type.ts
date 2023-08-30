import { CommonType } from '@/common/dto/common.type';
import { Field, ObjectType } from '@nestjs/graphql';
import { ReducibleTimeType } from './common.type';
import { TeacherType } from '@/modules/teacher/dto/teacher.type';

@ObjectType()
export class CourseType extends CommonType {
  @Field({
    description: 'course name',
  })
  name: string;

  @Field({
    description: 'course description',
    nullable: true,
  })
  desc: string;

  @Field({
    description: 'age group',
  })
  group: string;

  @Field({
    description: 'cover image',
    nullable: true,
  })
  coverUrl: string;

  @Field({
    description: 'base ability',
  })
  baseAbility: string;

  @Field({
    description: 'limit number',
  })
  limitNumber: number;

  @Field({
    description: 'duration',
  })
  duration: number;

  @Field({
    description: 'reservation info',
    nullable: true,
  })
  reserveInfo: string;

  @Field({
    description: 'refund info',
    nullable: true,
  })
  refundInfo: string;

  @Field({
    description: 'other info',
    nullable: true,
  })
  otherInfo: string;

  @Field(() => [ReducibleTimeType], {
    description: 'available time',
    nullable: true,
  })
  reducibleTime: ReducibleTimeType[];

  @Field(() => [TeacherType], {
    description: 'teachers',
    nullable: true,
  })
  teachers: TeacherType[];
}
