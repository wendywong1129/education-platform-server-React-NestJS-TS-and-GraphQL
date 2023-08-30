import { CommonType } from '@/common/dto/common.type';
import { OrganizationType } from '@/modules/organization/dto/organization.type';
import { ProductType } from '@/modules/product/dto/product.type';
import { StudentType } from '@/modules/student/dto/student.type';
import { WxorderType } from '@/modules/wxorder/dto/wxorder.type';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class OrderType extends CommonType {
  @Field({ nullable: true })
  id: string;

  @Field({
    description: 'quantity',
  })
  quantity: number;

  @Field({
    description: 'amount',
  })
  amount: number;

  @Field({
    description: 'mobile number',
  })
  tel: string;

  @Field({
    description: 'status',
  })
  status: string;

  @Field({
    description: 'createdAt',
    nullable: true,
  })
  createdAt: Date;

  @Field({
    description: 'out trade number',
    nullable: true,
  })
  outTradeNo: string;

  @Field(() => StudentType, { nullable: true, description: 'student' })
  student: StudentType;

  @Field(() => OrganizationType, {
    nullable: true,
    description: 'organization',
  })
  org: OrganizationType;

  @Field(() => ProductType, { nullable: true, description: 'product' })
  product: ProductType;

  @Field(() => WxorderType, { nullable: true, description: 'wxOrder' })
  wxOrder?: WxorderType;
}
