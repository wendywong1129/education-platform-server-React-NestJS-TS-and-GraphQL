import { CommonType } from '@/common/dto/common.type';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TeacherType extends CommonType {
  @Field({
    description: 'name',
  })
  name: string;

  @Field({
    description: 'photo',
    nullable: true,
  })
  photoUrl: string;

  @Field({
    description: 'teaching time',
    nullable: true,
  })
  teacherTime: number;

  @Field({
    description: 'tags',
    nullable: true,
  })
  tags: string;

  @Field({
    description: 'education',
    nullable: true,
  })
  education: string;

  @Field({
    description: 'seniority',
    nullable: true,
  })
  seniority: string;

  @Field({
    description: 'experience',
    nullable: true,
  })
  experience: string;

  @Field({
    description: 'prize',
    nullable: true,
  })
  carryPrize: string;
}
