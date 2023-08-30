import { CommonEntity } from '@/common/entities/common.entity';
import { Course } from '@/modules/course/models/course.entity';
import { Organization } from '@/modules/organization/models/organization.entity';
import { Teacher } from '@/modules/teacher/models/teacher.entity';
import { ScheduleRecord } from '@/modules/schedule-record/models/schedule-record.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity('schedule')
export class Schedule extends CommonEntity {
  @Column({
    comment: 'class date',
    nullable: true,
    type: 'timestamp',
  })
  schoolDay: Date;

  @Column({
    comment: 'start time',
    nullable: true,
  })
  startTime: string;

  @Column({
    comment: 'end time',
    nullable: true,
  })
  endTime: string;

  @Column({
    comment: 'limit number',
    nullable: true,
  })
  limitNumber: number;

  @ManyToOne(() => Organization, {
    cascade: true,
  })
  org: Organization;

  @ManyToOne(() => Course, {
    cascade: true,
  })
  course: Course;

  @ManyToOne(() => Teacher, {
    cascade: true,
  })
  teacher?: Teacher;

  @OneToMany(() => ScheduleRecord, (scheduleRecord) => scheduleRecord.schedule)
  scheduleRecords?: ScheduleRecord[];
}
