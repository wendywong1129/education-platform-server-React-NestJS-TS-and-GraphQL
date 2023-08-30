import { Column, Entity, ManyToOne, OneToOne } from 'typeorm';
import { CommonEntity } from '@/common/entities/common.entity';
import { Organization } from '@/modules/organization/models/organization.entity';
import { Order } from '@/modules/order/models/order.entity';

@Entity('wxorder')
export class Wxorder extends CommonEntity {
  @Column({
    comment: 'appid',
  })
  appid: string;

  @Column({
    comment: 'mchid',
  })
  mchid: string;

  @Column({
    comment: 'openid',
    nullable: true,
  })
  openid: string;

  @Column({
    comment: 'trade type',
    nullable: true,
  })
  trade_type: string;

  @Column({
    comment: 'trade state',
    nullable: true,
  })
  trade_state: string;

  @Column({
    comment: ' bank type',
    nullable: true,
  })
  bank_type: string;

  @Column({
    comment: 'transaction id',
    nullable: true,
  })
  transaction_id: string;

  @Column({
    comment: 'out trade number',
    nullable: true,
  })
  out_trade_no: string;

  @Column({
    comment: 'attach data',
    nullable: true,
  })
  attach: string;

  @Column({
    comment: 'trade state description',
    nullable: true,
  })
  trade_state_desc: string;

  @Column({
    comment: 'payment success time',
    nullable: true,
  })
  success_time: string;

  @Column({
    comment: 'total amount',
    nullable: true,
  })
  total: number;

  @Column({
    comment: 'payer amount',
    nullable: true,
  })
  payer_total: number;

  @Column({
    comment: 'currency',
    nullable: true,
  })
  currency: string;

  @Column({
    comment: 'payer currency',
    nullable: true,
  })
  payer_currency: string;

  @ManyToOne(() => Organization, { cascade: true })
  org?: Organization;

  @OneToOne(() => Order, (order) => order.wxOrder)
  order?: Order;
}
