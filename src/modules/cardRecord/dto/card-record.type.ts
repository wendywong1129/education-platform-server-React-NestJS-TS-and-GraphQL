import { Field, ObjectType } from '@nestjs/graphql';
import { CardType } from '@/modules/card/dto/card.type';
import { StudentType } from '@/modules/student/dto/student.type';
import { Organization } from '@/modules/organization/models/organization.entity';
import { OrganizationType } from '@/modules/organization/dto/organization.type';
import { CourseType } from '@/modules/course/dto/course.type';

@ObjectType()
export class CardRecordType {
  @Field({
    description: 'id',
  })
  id: string;

  @Field({
    description: 'start time',
    nullable: true,
  })
  startTime: Date;

  @Field({
    description: 'end time',
    nullable: true,
  })
  endTime: Date;

  @Field({
    description: 'buy time',
    nullable: true,
  })
  buyTime: Date;

  @Field({
    description: 'residue time',
    nullable: true,
  })
  residueTime: number;

  @Field({
    description: 'status',
    nullable: true,
  })
  status?: string;

  @Field(() => CardType, {
    nullable: true,
    description: 'associated card',
  })
  card: CardType;

  @Field(() => CourseType, { nullable: true, description: 'course' })
  course: CourseType;

  @Field(() => StudentType, { nullable: true, description: 'student' })
  student: StudentType;

  @Field(() => OrganizationType, {
    nullable: true,
    description: 'organization',
  })
  org: Organization;
}
