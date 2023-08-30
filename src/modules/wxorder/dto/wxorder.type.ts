import { CommonType } from '@/common/dto/common.type';
import { OrganizationType } from '@/modules/organization/dto/organization.type';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class WxorderType extends CommonType {
  @Field({
    description: 'appid',
  })
  appid: string;

  @Field({
    description: 'mchid',
  })
  mchid: string;

  @Field({
    description: 'openid',
    nullable: true,
  })
  openid: string;

  @Field({
    description: 'trade type',
    nullable: true,
  })
  trade_type: string;

  @Field({
    description: 'trade state',
    nullable: true,
  })
  trade_state: string;

  @Field({
    description: 'bank type',
    nullable: true,
  })
  bank_type: string;

  @Field({
    description: 'transaction id',
    nullable: true,
  })
  transaction_id: string;

  @Field({
    description: 'out trade number',
    nullable: true,
  })
  out_trade_no: string;

  @Field({
    description: 'attach data',
    nullable: true,
  })
  attach: string;

  @Field({
    description: 'trade state description',
    nullable: true,
  })
  trade_state_desc: string;

  @Field({
    description: 'payment success time',
    nullable: true,
  })
  success_time: string;

  @Field({
    description: 'total amount',
    nullable: true,
  })
  total: number;

  @Field({
    description: 'payer total amount',
    nullable: true,
  })
  payer_total: number;

  @Field({
    description: 'currency',
    nullable: true,
  })
  currency: string;

  @Field({
    description: 'payer currency',
    nullable: true,
  })
  payer_currency: string;

  @Field(() => OrganizationType, { nullable: true, description: '门店' })
  org?: OrganizationType;
}
