import { Organization } from '@/modules/organization/models/organization.entity';
import { CommonEntity } from '@/common/entities/common.entity';
import { Course } from '@/modules/course/models/course.entity';
import { IsNotEmpty } from 'class-validator';
import { Column, Entity, ManyToOne } from 'typeorm';
import { CardType } from '@/common/constants/enmu';

@Entity('card')
export class Card extends CommonEntity {
  @Column({
    comment: 'card name',
    default: '',
  })
  name: string;

  @Column({
    comment: 'card type',
    default: CardType.TIME,
  })
  @IsNotEmpty()
  type: string;

  @Column({
    comment: 'course times',
    default: 0,
  })
  time: number;

  @Column({
    comment: 'validityDay',
    default: 0,
  })
  validityDay: number;

  // associated course
  @ManyToOne(() => Course, (course) => course.cards, {
    cascade: true,
  })
  course: Course;

  // associated organization
  @ManyToOne(() => Organization, (org) => org.cards, {
    cascade: true,
  })
  org: Organization;
}
