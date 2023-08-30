import { CommonType } from '@/common/dto/common.type';
import { OrgImageType } from '@/modules/orgImage/dto/orgImage.output';
import { Field, ObjectType } from '@nestjs/graphql';
import { CourseType } from '@/modules/course/dto/course.type';

@ObjectType()
export class OrganizationType extends CommonType {
  @Field({
    description: 'business license',
  })
  businessLicense: string;

  @Field({
    description: 'front image of identity',
  })
  identityCardFrontImg: string;

  @Field({
    description: 'back image of identity',
  })
  identityCardBackImg: string;

  @Field({
    description: 'tags',
    nullable: true,
  })
  tags: string;

  @Field({
    description: 'organization description',
    nullable: true,
  })
  description: string;

  @Field({
    description: 'organization name',
    nullable: true,
  })
  name: string;

  @Field({
    description: 'logo',
    nullable: true,
  })
  logo: string;

  @Field({
    description: 'longitude',
    nullable: true,
  })
  longitude: string;

  @Field({
    description: 'latitude',
    nullable: true,
  })
  latitude: string;

  @Field({
    description: 'address',
    nullable: true,
  })
  address?: string;

  @Field({
    description: 'tel',
    nullable: true,
  })
  tel: string;

  @Field(() => [OrgImageType], {
    nullable: true,
    description: 'front image of organization',
  })
  orgFrontImg?: OrgImageType[];

  @Field(() => [OrgImageType], {
    nullable: true,
    description: 'indoor image of organization',
  })
  orgRoomImg?: OrgImageType[];

  @Field(() => [OrgImageType], {
    nullable: true,
    description: 'front image of organization',
  })
  orgOtherImg?: OrgImageType[];

  @Field(() => [CourseType], {
    nullable: true,
    description: "organization's courses",
  })
  courses?: CourseType[];
}
