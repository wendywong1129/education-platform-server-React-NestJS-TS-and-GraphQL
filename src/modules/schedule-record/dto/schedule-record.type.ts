import { ObjectType, Field } from '@nestjs/graphql';
import { StudentType } from '@/modules/student/dto/student.type';
import { ScheduleType } from '@/modules/schedule/dto/schedule.type';
import { OrganizationType } from '@/modules/organization/dto/organization.type';
import { CourseType } from '@/modules/course/dto/course.type';

/**
 * 约课记录
 */
@ObjectType('ScheduleRecordType')
export class ScheduleRecordType {
  @Field({
    description: 'id',
  })
  id: string;

  @Field({
    description: 'status',
    nullable: true,
  })
  status: string;

  @Field({
    description: 'subscribe time',
    nullable: true,
  })
  subscribeTime: Date;

  @Field(() => StudentType, { nullable: true, description: 'student' })
  student: StudentType;

  @Field(() => ScheduleType, { nullable: true, description: 'schedule' })
  schedule: ScheduleType;

  @Field(() => OrganizationType, {
    nullable: true,
    description: 'organization',
  })
  org: OrganizationType;

  @Field(() => CourseType, { nullable: true, description: 'course' })
  course: CourseType;
}
