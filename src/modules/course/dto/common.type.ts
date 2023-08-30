import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class OrderTimeType {
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

@ObjectType()
export class ReducibleTimeType {
  @Field({
    description: 'weekday',
  })
  week: string;

  @Field(() => [OrderTimeType], {
    description: 'available time json',
  })
  orderTime: OrderTimeType[];
}
