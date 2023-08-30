import { CommonEntity } from '@/common/entities/common.entity';
import { Column, Entity, ManyToOne, OneToOne } from 'typeorm';
import { Product } from '@/modules/product/models/product.entity';
import { Organization } from '@/modules/organization/models/organization.entity';
import { Student } from '@/modules/student/models/student.entity';
import { Wxorder } from '@/modules/wxorder/models/wxorder.entity';

@Entity('order')
export class Order extends CommonEntity {
  @Column({
    comment: 'out trade number',
    default: '',
  })
  outTradeNo: string;

  @Column({
    comment: 'mobile number',
    nullable: true,
  })
  tel: string;

  @Column({
    comment: 'quantity',
    nullable: true,
  })
  quantity: number;

  @Column({
    comment: 'total amount',
    nullable: true,
  })
  amount: number;

  @Column({
    comment: 'payment status',
    nullable: true,
  })
  status: string;

  @ManyToOne(() => Product, {
    cascade: true,
  })
  product: Product;

  @ManyToOne(() => Organization, {
    cascade: true,
  })
  org: Organization;

  @ManyToOne(() => Student, {
    cascade: true,
  })
  student: Student;

  @OneToOne(() => Wxorder, (wxorder) => wxorder.order, { cascade: true })
  wxOrder?: Wxorder;
}
