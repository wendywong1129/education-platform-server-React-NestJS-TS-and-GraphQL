import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UserInput {
  @Field({ description: 'nickname' })
  name?: string;
  @Field({ description: 'description' })
  desc: string;
  @Field({ description: 'avatar' })
  avatar: string;
}
