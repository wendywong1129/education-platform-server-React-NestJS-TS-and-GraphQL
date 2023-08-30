import { Field, ObjectType } from '@nestjs/graphql';
import { CourseType } from '../../course/dto/course.type';

@ObjectType('CardType')
export class CardType {
  @Field({
    description: 'id',
  })
  id: string;

  @Field({
    description: 'card name',
  })
  name: string;

  @Field({
    description: `card type 
     TIMES = "times",
    DURATION = "duration"`,
  })
  type: string;

  @Field({
    description: 'course times',
  })
  time: number;

  @Field({
    description: 'validityDay(day)',
  })
  validityDay: number;

  @Field(() => CourseType, {
    description: 'course',
  })
  course: CourseType;
}
