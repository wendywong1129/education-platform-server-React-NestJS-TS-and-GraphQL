import { Field, InputType } from '@nestjs/graphql';

@InputType()
class OrderTimeInput {
  @Field({
    description: 'start time',
  })
  startTime: string;

  @Field({
    description: 'end time',
  })
  endTime: string;

  @Field({
    description: 'key',
  })
  key: number;
}

@InputType()
export class ReducibleTimeInput {
  @Field({
    description: 'weekday',
  })
  week: string;

  @Field(() => [OrderTimeInput], {
    description: 'available time json',
  })
  orderTime: OrderTimeInput[];
}
