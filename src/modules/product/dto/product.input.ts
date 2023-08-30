import { Field, InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class ProductInput {
  @Field({
    description: 'product name',
  })
  name: string;

  @Field({
    description: 'product description',
    nullable: true,
  })
  desc: string;

  @Field({
    description: 'product status',
    nullable: true,
  })
  status: string;

  @Field({
    description: 'product type',
    nullable: true,
  })
  type: string;

  @Field({
    description: 'stock',
  })
  stock: number;

  @Field({
    description: 'limit buy number',
  })
  limitBuyNumber: number;

  @Field({
    description: 'cover image',
  })
  coverUrl: string;

  @Field({
    description: 'banner',
  })
  bannerUrl: string;

  @Field({
    description: 'original price',
  })
  originalPrice: number;

  @Field({
    description: 'sale price',
  })
  preferentialPrice: number;

  @Field(() => [String], {
    description: 'consumer cards',
  })
  cards: string[];
}

@InputType()
export class PartialProductInput extends PartialType(ProductInput) {}
