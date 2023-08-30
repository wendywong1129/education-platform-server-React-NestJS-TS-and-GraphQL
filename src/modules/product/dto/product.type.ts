import { OrganizationType } from './../../organization/dto/organization.type';
import { CommonType } from '@/common/dto/common.type';
import { CardType } from '@/modules/card/dto/card.type';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ProductType extends CommonType {
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
  })
  status: string;

  @Field({
    description: 'product type',
    nullable: true,
  })
  type: string;

  @Field({
    description: 'distance',
  })
  distance?: string;

  @Field({
    description: 'stock',
  })
  stock: number;

  @Field({
    description: 'current stock',
  })
  curStock: number;

  @Field({
    description: 'buy number',
  })
  buyNumber: number;

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

  @Field(() => OrganizationType, {
    description: 'organization',
  })
  org: OrganizationType;

  @Field(() => [CardType], {
    description: 'consumer cards',
    nullable: true,
  })
  cards?: CardType[];
}
