import { Field, InputType } from '@nestjs/graphql';
import { IsInt, Min } from 'class-validator';

@InputType()
export class PageInput {
  @Field()
  @IsInt()
  @Min(0)
  // start: number;
  pageNum: number;

  @Field()
  @IsInt()
  @Min(0)
  // length: number;
  pageSize: number;
}
