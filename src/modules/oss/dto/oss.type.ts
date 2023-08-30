import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class OSSType {
  @Field({ description: 'expiration' })
  expire: string;
  @Field({ description: 'policy' })
  policy: string;
  @Field({ description: 'signature' })
  signature: string;
  @Field({ description: 'key' })
  accessId: string;
  @Field({ description: 'host' })
  host: string;
  @Field({ description: 'dir' })
  dir: string;
}
