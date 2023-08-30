import { IsNotEmpty } from 'class-validator';
import { CommonEntity } from '@/common/entities/common.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { OrgImage } from '@/modules/orgImage/models/orgImage.entity';
import { Course } from '@/modules/course/models/course.entity';
import { Card } from '@/modules/card/models/card.entity';
import { Product } from '@/modules/product/models/product.entity';

@Entity('organization')
export class Organization extends CommonEntity {
  @Column({
    comment: 'business license',
  })
  @IsNotEmpty()
  businessLicense: string;

  @Column({
    comment: 'front image of identity',
  })
  @IsNotEmpty()
  identityCardFrontImg: string;

  @Column({
    comment: 'back image of identity',
  })
  @IsNotEmpty()
  identityCardBackImg: string;

  @Column({
    type: 'text',
    comment: 'tags',
    nullable: true,
  })
  tags: string;

  @Column({
    type: 'text',
    comment: 'organization description',
    nullable: true,
  })
  description: string;

  @Column({
    comment: 'organization name',
    nullable: true,
    default: '',
  })
  name: string;

  @Column({
    comment: 'logo',
    nullable: true,
  })
  logo: string;

  @Column({
    comment: 'address',
    nullable: true,
  })
  address: string;

  @Column({
    comment: 'longitude',
    nullable: true,
  })
  longitude: string;

  @Column({
    comment: 'latitude',
    nullable: true,
  })
  latitude: string;

  @Column({
    comment: 'tel',
    nullable: true,
  })
  tel: string;

  @OneToMany(() => OrgImage, (orgImage) => orgImage.orgIdForFront, {
    cascade: true,
  })
  orgFrontImg?: OrgImage[];

  @OneToMany(() => OrgImage, (orgImage) => orgImage.orgIdForRoom, {
    cascade: true,
  })
  orgRoomImg?: OrgImage[];

  @OneToMany(() => OrgImage, (orgImage) => orgImage.orgIdForOther, {
    cascade: true,
  })
  orgOtherImg?: OrgImage[];

  @OneToMany(() => Course, (course) => course.org)
  courses: Course[];

  @OneToMany(() => Card, (card) => card.org)
  cards: Card[];

  @OneToMany(() => Product, (product) => product.org)
  products: Product[];
}
