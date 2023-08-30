import { CommonEntity } from '@/common/entities/common.entity';
import { CardRecord } from '@/modules/cardRecord/models/card-record.entity';
import { Course } from '@/modules/course/models/course.entity';
import { Organization } from '@/modules/organization/models/organization.entity';
import { Schedule } from '@/modules/schedule/models/schedule.entity';
import { Student } from '@/modules/student/models/student.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity('schedule_record')
export class ScheduleRecord extends CommonEntity {
  @Column({
    comment: 'subscribe time',
    type: 'timestamp',
    nullable: true,
  })
  subscribeTime: Date;

  @Column({
    comment: 'status',
    nullable: true,
  })
  status: string;

  @ManyToOne(() => Student, { cascade: true })
  student: Student;

  @ManyToOne(() => CardRecord, { cascade: true })
  cardRecord: CardRecord;

  @ManyToOne(() => Course, { cascade: true })
  course: Course;

  @ManyToOne(() => Organization, {
    cascade: true,
  })
  org: Organization;

  @ManyToOne(() => Schedule, (schedule) => schedule.scheduleRecords, {
    cascade: true,
  })
  schedule: Schedule;
}
