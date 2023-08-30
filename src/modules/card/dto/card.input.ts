import { Field, InputType } from '@nestjs/graphql';

/**
 * 消费卡
 */
@InputType('CardInput')
export class CardInput {
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
    nullable: true,
  })
  time: number;

  @Field({
    description: 'validityDay(day)',
  })
  validityDay: number;
}
