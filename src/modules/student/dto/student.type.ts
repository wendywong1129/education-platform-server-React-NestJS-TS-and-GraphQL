import { CommonType } from '@/common/dto/common.type';
import { Field, ObjectType } from '@nestjs/graphql';

/**
+ * Student
+ */
@ObjectType()
export class StudentType extends CommonType {
  @Field({
    description: 'nickname',
  })
  name: string;

  @Field({
    description: 'mobile',
  })
  tel: string;

  @Field({
    description: 'avatar',
    nullable: true,
  })
  avatar: string;

  @Field({
    description: 'account',
    nullable: true,
  })
  account: string;

  @Field({
    description: 'openid',
    nullable: true,
  })
  openid?: string;
}
