import { validateOrReject, IsDate, IsOptional } from 'class-validator';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
} from 'typeorm';

export class CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    comment: 'createdAt',
    type: 'timestamp',
  })
  createdAt: Date;

  @Column({
    comment: 'createdBy',
    nullable: true,
  })
  @IsOptional()
  createdBy: string;

  @Column({
    comment: 'updatedAt',
    type: 'timestamp',
    nullable: true,
  })
  updatedAt: Date;

  @Column({
    comment: 'updatedBy',
    nullable: true,
  })
  @IsOptional()
  updatedBy: string;

  @Column({
    comment: 'deletedAt',
    type: 'timestamp',
    nullable: true,
  })
  @DeleteDateColumn()
  @IsDate()
  @IsOptional()
  deletedAt: Date;

  @Column({
    comment: 'deletedBy',
    nullable: true,
  })
  @IsOptional()
  deletedBy: string;

  @BeforeInsert()
  setCreatedAt() {
    const now = new Date();
    this.createdAt = now;
    this.updatedAt = now;
  }

  @BeforeUpdate()
  setUpdatedAt() {
    this.updatedAt = new Date();
  }

  @BeforeInsert()
  async validateBeforeInsert() {
    await validateOrReject(this);
  }

  @BeforeUpdate()
  async validateBeforeUpdate() {
    await validateOrReject(this, { skipMissingProperties: true });
  }
}
