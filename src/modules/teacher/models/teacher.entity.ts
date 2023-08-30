import { Organization } from '@/modules/organization/models/organization.entity';
import { Entity, Column, ManyToOne } from 'typeorm';
import { CommonEntity } from '@/common/entities/common.entity';

@Entity('teacher')
export class Teacher extends CommonEntity {
  @Column({
    comment: 'name',
  })
  name: string;

  @Column({
    comment: 'photo',
    nullable: true,
  })
  photoUrl: string;

  @Column({
    comment: 'teaching time',
    nullable: true,
  })
  teacherTime: number;

  @Column({
    comment: 'education',
    nullable: true,
  })
  education: string;

  @Column({
    comment: 'seniority',
    nullable: true,
  })
  seniority: string;

  @Column({
    comment: 'experience',
    nullable: true,
  })
  experience: string;

  @Column({
    comment: 'prize',
    nullable: true,
  })
  carryPrize: string;

  @Column({
    comment: 'tags',
    nullable: true,
  })
  tags: string;

  @ManyToOne(() => Organization)
  org: Organization;
}
