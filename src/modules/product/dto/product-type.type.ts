import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ProductTypeType {
  @Field({
    description: 'key',
  })
  key: string;

  @Field({
    description: 'title',
  })
  title: string;
}
