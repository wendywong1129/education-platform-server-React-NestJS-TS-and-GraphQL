import { CommonEntity } from '@/common/entities/common.entity';
import { Card } from '@/modules/card/models/card.entity';
import { Course } from '@/modules/course/models/course.entity';
import { Organization } from '@/modules/organization/models/organization.entity';
import { Student } from '@/modules/student/models/student.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity('card_record')
export class CardRecord extends CommonEntity {
  @Column({
    comment: 'start time',
    type: 'timestamp',
    nullable: true,
  })
  startTime: Date;

  @Column({
    comment: 'end time',
    type: 'timestamp',
    nullable: true,
  })
  endTime: Date;

  @Column({
    comment: 'buy time',
    type: 'timestamp',
    nullable: true,
  })
  buyTime: Date;

  @Column({
    comment: 'residue time',
    nullable: true,
  })
  residueTime: number;

  @ManyToOne(() => Card, {
    cascade: true,
  })
  card: Card;

  @ManyToOne(() => Student, {
    cascade: true,
  })
  student: Student;

  @ManyToOne(() => Course, {
    cascade: true,
  })
  course: Course;

  @ManyToOne(() => Organization, {
    cascade: true,
  })
  org: Organization;
}
