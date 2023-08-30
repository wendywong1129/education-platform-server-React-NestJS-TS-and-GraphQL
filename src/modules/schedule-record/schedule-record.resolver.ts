import { CardRecordService } from './../cardRecord/card-record.service';
import {
  CANCEL_SCHEDULE_FAIL,
  COURSE_DEL_FAIL,
  COURSE_NOT_EXIST,
  SCHEDULE_RECORD_NOT_EXIST,
} from './../../common/constants/code';
import { Result } from '@/common/dto/result.type';
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '@/common/guards/auth.guard';
import { SUCCESS } from '@/common/constants/code';
import {
  ScheduleRecordResult,
  ScheduleRecordResults,
} from './dto/result-schedule-record.output';
import { ScheduleRecordType } from './dto/schedule-record.type';
import { ScheduleRecordService } from './schedule-record.service';
import { CurUserId } from '@/common/decorators/current-user.decorator';
import { PageInput } from '@/common/dto/page.input';
import { CardType, ScheduleStatus } from '@/common/constants/enmu';
import * as dayjs from 'dayjs';

@Resolver(() => ScheduleRecordType)
@UseGuards(GqlAuthGuard)
export class ScheduleRecordResolver {
  constructor(
    private readonly scheduleRecordService: ScheduleRecordService,
    private readonly cardRecordService: CardRecordService,
  ) {}

  @Query(() => ScheduleRecordResult)
  async getScheduleRecordInfo(
    @Args('id') id: string,
  ): Promise<ScheduleRecordResult> {
    const result = await this.scheduleRecordService.findById(id);
    if (result) {
      return {
        code: SUCCESS,
        data: result,
        message: 'Get schedule record info successfully',
      };
    }
    return {
      code: COURSE_NOT_EXIST,
      message: 'Schedule record info does not exist',
    };
  }

  @Query(() => ScheduleRecordResults, {
    description: 'get schedule records of a student',
  })
  async getScheduleRecords(
    @Args('page') page: PageInput,
    @CurUserId() userId: string,
  ): Promise<ScheduleRecordResults> {
    const { pageNum, pageSize } = page;

    const [scheduleRecords, total] =
      await this.scheduleRecordService.findScheduleRecords({
        start: (pageNum - 1) * pageSize,
        length: pageSize,
        where: {
          student: {
            id: userId,
          },
        },
      });

    const data: ScheduleRecordType[] = [];
    for (const scheduleRecord of scheduleRecords) {
      let status = ScheduleStatus.NO_DO;
      const { schedule } = scheduleRecord;
      const startTime = dayjs(
        `${dayjs(schedule.schoolDay).format('YYYYMMDD')} ${schedule.startTime}`,
        'YYYYMMDD HH:mm:ss',
      );
      if (dayjs().isAfter(startTime)) {
        status = ScheduleStatus.DOING;
      }
      const endTime = dayjs(
        `${dayjs(schedule.schoolDay).format('YYYYMMDD')} ${schedule.endTime}`,
        'YYYYMMDD HH:mm:ss',
      );

      if (dayjs().isAfter(endTime)) {
        status = ScheduleStatus.FINISH;
      }

      if (!scheduleRecord.status) {
        data.push({
          ...scheduleRecord,
          status,
        });
      } else {
        data.push(scheduleRecord);
      }
    }

    return {
      code: SUCCESS,
      data,
      message: 'Get schedule records of a student successfully',
      page: {
        pageNum,
        pageSize,
        total,
      },
    };
  }

  @Mutation(() => Result)
  async deleteScheduleRecord(
    @Args('id') id: string,
    @CurUserId() userId: string,
  ): Promise<Result> {
    const result = await this.scheduleRecordService.findById(id);
    if (result) {
      const delRes = await this.scheduleRecordService.deleteById(id, userId);
      if (delRes) {
        return {
          code: SUCCESS,
          message: 'Delete the schedule record info successfully',
        };
      }
      return {
        code: COURSE_DEL_FAIL,
        message: 'Failed to delete the schedule record info',
      };
    }
    return {
      code: COURSE_NOT_EXIST,
      message: 'Schedule record info does not exist',
    };
  }

  @Mutation(() => Result, {
    description: 'cancel subscribed course',
  })
  async cancelSubscribeCourse(
    @Args('scheduleRecordId') scheduleRecordId: string,
    @CurUserId() userId: string,
  ): Promise<Result> {
    const scheduleRecord = await this.scheduleRecordService.findById(
      scheduleRecordId,
    );

    if (!scheduleRecord) {
      return {
        code: SCHEDULE_RECORD_NOT_EXIST,
        message: 'No subscription history. You cannot cancel it.',
      };
    }

    if (scheduleRecord.status === ScheduleStatus.CANCEL) {
      return {
        code: CANCEL_SCHEDULE_FAIL,
        message:
          'Failed to cancel it. You cannot cancel the subscription many times',
      };
    }

    const { schedule } = scheduleRecord;

    const startTime = dayjs(
      `${dayjs(schedule.schoolDay).format('YYYYMMDD')} ${schedule.startTime}`,
      'YYYYMMDD HH:mm:ss',
    );

    if (dayjs().isAfter(startTime.subtract(15, 'm'))) {
      return {
        code: CANCEL_SCHEDULE_FAIL,
        message: 'Course starts. You cannot cancel it.',
      };
    }

    const res = await this.scheduleRecordService.updateById(scheduleRecordId, {
      status: ScheduleStatus.CANCEL,
      updatedBy: userId,
    });

    if (!res) {
      return {
        code: CANCEL_SCHEDULE_FAIL,
        message: 'Failed to update subscription history',
      };
    }

    const cardRecord = await this.cardRecordService.findById(
      scheduleRecord.cardRecord.id,
    );
    if (cardRecord.card.type === CardType.TIME) {
      const r = await this.cardRecordService.updateById(cardRecord.id, {
        residueTime: cardRecord.residueTime + 1,
        updatedBy: userId,
      });
      if (!r) {
        return {
          code: CANCEL_SCHEDULE_FAIL,
          message: 'Failed to recover residue times of card',
        };
      }
    }
    return {
      code: SUCCESS,
      message: 'Cancel successfully',
    };
  }
}
