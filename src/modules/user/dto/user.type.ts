import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserType {
  @Field()
  id?: string;
  @Field({ description: 'nickname' })
  name?: string;
  @Field({ description: 'description' })
  desc: string;
  // @Field({ description: 'account info' })
  // account: string;
  @Field({ description: 'tel' })
  tel: string;
  @Field({ description: 'avatar', nullable: true })
  avatar?: string;
}
