import { ProductStatus } from '@/common/constants/enmu';
import { Organization } from './../../organization/models/organization.entity';
import { CommonEntity } from '@/common/entities/common.entity';
import { Card } from '@/modules/card/models/card.entity';
import { IsNotEmpty, Min } from 'class-validator';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';

@Entity('product')
export class Product extends CommonEntity {
  @Column({
    comment: 'product name',
  })
  @IsNotEmpty()
  name: string;

  @Column({
    comment: 'product description',
    nullable: true,
  })
  desc: string;

  @Column({
    comment: 'product status: list, unlist',
    default: ProductStatus.UN_LIST,
  })
  @IsNotEmpty()
  status: string;

  @Column({
    comment: 'product type',
    nullable: true,
  })
  type: string;

  @Column({
    comment: 'stock',
    default: 0,
  })
  stock: number;

  @Column({
    comment: 'current stock',
    default: 0,
  })
  curStock: number;

  @Column({
    comment: 'buy number',
    default: 0,
  })
  buyNumber: number;

  @Column({
    comment: 'limit buy number',
    default: -1,
  })
  limitBuyNumber: number;

  @Column({
    comment: 'cover image',
  })
  coverUrl: string;

  @Column({
    comment: 'banner',
  })
  bannerUrl: string;

  @Column({
    type: 'float',
    comment: 'original price',
  })
  @IsNotEmpty()
  @Min(0.01)
  originalPrice: number;

  @Column({
    type: 'float',
    comment: 'sale price',
  })
  @IsNotEmpty()
  @Min(0.01)
  preferentialPrice: number;

  @ManyToOne(() => Organization, (org) => org.products, {
    cascade: true,
  })
  org: Organization;

  @ManyToMany(() => Card, { cascade: true })
  @JoinTable({
    name: 'product_card',
  })
  cards: Card[];
}
