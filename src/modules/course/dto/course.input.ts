import { Field, InputType, PartialType } from '@nestjs/graphql';
import { ReducibleTimeInput } from './common.input';
// import { ReducibleTimeInput } from './common.input';
// import { TeacherInput } from '@/modules/teacher/dto/teacher.input';

@InputType()
export class CourseInput {
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
    description: 'base ability',
  })
  baseAbility: string;

  @Field({
    description: 'cover image',
  })
  coverUrl: string;

  @Field({
    description: 'student limit of a course',
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

  @Field(() => [ReducibleTimeInput], {
    description: 'available time',
    nullable: true,
  })
  reducibleTime: ReducibleTimeInput[];

  @Field(() => [String], {
    description: 'teachers',
    nullable: true,
  })
  teachers: string[];
}

@InputType()
export class PartialCourseInput extends PartialType(CourseInput) {}
