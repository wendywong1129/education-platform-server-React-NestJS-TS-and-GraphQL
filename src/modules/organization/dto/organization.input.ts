import { OrgImageInput } from './../../orgImage/dto/orgImage.input';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class OrganizationInput {
  @Field({
    description: 'organization name',
  })
  name: string;

  @Field({
    description: 'logo',
  })
  logo: string;

  @Field({
    description: 'tel',
    nullable: true,
  })
  tel: string;

  @Field({
    description: 'tags',
    nullable: true,
  })
  tags: string;

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
    description: 'latitude',
    nullable: true,
  })
  address: string;

  @Field({
    description: 'business license',
  })
  businessLicense: string;

  @Field({
    description: 'organization description',
  })
  description: string;

  @Field({
    description: 'front image of identity',
  })
  identityCardFrontImg: string;

  @Field({
    description: 'back image of identity',
  })
  identityCardBackImg: string;

  @Field(() => [OrgImageInput], {
    nullable: true,
    description: 'front image of organization',
  })
  orgFrontImg?: OrgImageInput[];

  @Field(() => [OrgImageInput], {
    nullable: true,
    description: 'indoor image of organization',
  })
  orgRoomImg?: OrgImageInput[];

  @Field(() => [OrgImageInput], {
    nullable: true,
    description: 'other image of organization',
  })
  orgOtherImg?: OrgImageInput[];
}
