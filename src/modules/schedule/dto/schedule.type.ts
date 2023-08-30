import { CommonType } from '@/common/dto/common.type';
import { CourseType } from '@/modules/course/dto/course.type';
import { OrganizationType } from '@/modules/organization/dto/organization.type';
import { TeacherType } from '@/modules/teacher/dto/teacher.type';
import { ScheduleRecordType } from '@/modules/schedule-record/dto/schedule-record.type';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ScheduleType extends CommonType {
  @Field({
    description: 'id',
  })
  id: string;

  @Field({
    description: 'class date',
    nullable: true,
  })
  schoolDay: Date;

  @Field({
    description: 'start time',
    nullable: true,
  })
  startTime: string;

  @Field({
    description: 'end time',
    nullable: true,
  })
  endTime: string;

  @Field({
    description: 'limit number',
    nullable: true,
  })
  limitNumber: number;

  @Field(() => CourseType, { nullable: true, description: 'course info' })
  course: CourseType;

  @Field(() => OrganizationType, {
    nullable: true,
    description: 'organization info',
  })
  org: OrganizationType;

  @Field(() => TeacherType, { nullable: true, description: 'teacher' })
  teacher?: TeacherType;

  @Field(() => [ScheduleRecordType], {
    nullable: true,
    description: 'reservation history',
  })
  scheduleRecords?: ScheduleRecordType[];
}
