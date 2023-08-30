import { FindOptionsWhere } from 'typeorm';
import { Schedule } from './models/schedule.entity';
import {
  CARD_DEPLETE,
  CARD_EXPIRED,
  CARD_NOT_EXIST,
  CARD_RECORD_EXIST,
  COURSE_DEL_FAIL,
  COURSE_NOT_EXIST,
  SCHEDULE_CREATE_FAIL,
  SCHEDULE_HAD_SUBSCRIBE,
  SCHEDULE_NOT_EXIST,
  SUBSCRIBE_FAIL,
} from './../../common/constants/code';
import { Result } from '@/common/dto/result.type';
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '@/common/guards/auth.guard';
import { SUCCESS } from '@/common/constants/code';
import { ScheduleResult, ScheduleResults } from './dto/result-schedule.output';
import { ScheduleType } from './dto/schedule.type';
import { ScheduleService } from './schedule.service';
import { CurUserId } from '@/common/decorators/current-user.decorator';
import { CurOrgId } from '@/common/decorators/current-org.decorator';
import { CourseService } from '../course/course.service';
import * as dayjs from 'dayjs';
import { OrderTimeType } from '../course/dto/common.type';
import { CardRecordService } from '../cardRecord/card-record.service';
import { OrganizationResults } from '../organization/dto/result-organization.output';
import { OrganizationType } from '../organization/dto/organization.type';
import * as _ from 'lodash';
import { CardType } from '@/common/constants/enmu';
import { ScheduleRecordService } from '../schedule-record/schedule-record.service';

@Resolver(() => ScheduleType)
@UseGuards(GqlAuthGuard)
export class ScheduleResolver {
  constructor(
    private readonly scheduleService: ScheduleService,
    private readonly courseService: CourseService,
    private readonly scheduleRecordService: ScheduleRecordService,
    private readonly cardRecordService: CardRecordService,
  ) {}

  @Query(() => ScheduleResult)
  async getScheduleInfo(@Args('id') id: string): Promise<ScheduleResult> {
    const result = await this.scheduleService.findById(id);
    if (result) {
      return {
        code: SUCCESS,
        data: result,
        message: 'Get schedule info successfully',
      };
    }
    return {
      code: COURSE_NOT_EXIST,
      message: 'Schedule info does not exist',
    };
  }

  @Mutation(() => Result, { description: 'auto create schedule' })
  async autoCreateSchedule(
    @Args('startDay') startDay: string,
    @Args('endDay') endDay: string,
    @CurUserId() userId: string,
    @CurOrgId() orgId: string,
  ): Promise<Result> {
    const [courses] = await this.courseService.findCourses({
      where: {
        org: {
          id: orgId,
        },
      },
      start: 0,
      length: 100,
    });

    const schedules = [];
    for (const course of courses) {
      const reducibleTime = course.reducibleTime;
      const newReducibleTime: Record<string, OrderTimeType[]> = {};
      for (const rt of reducibleTime) {
        newReducibleTime[rt.week] = rt.orderTime; // {"monday":[{ startTime: '14:30:00', endTime: '15:30:00', key: 1 }]}
      }

      let curDay = dayjs(startDay);
      while (curDay.isBefore(dayjs(endDay).add(1, 'd'))) {
        const curWeekday = curDay.format('dddd');
        const orderTime = newReducibleTime[curWeekday];
        if (orderTime && orderTime.length > 0) {
          for (const ot of orderTime) {
            const [oldSchedule] = await this.scheduleService.findSchedules({
              where: {
                org: {
                  id: orgId,
                },
                startTime: ot.startTime,
                endTime: ot.endTime,
                schoolDay: curDay.toDate(),
                course: {
                  id: course.id,
                },
              },
              start: 0,
              length: 10,
            });
            if (oldSchedule.length === 0) {
              const schedule = new Schedule();
              schedule.startTime = ot.startTime;
              schedule.endTime = ot.endTime;
              schedule.limitNumber = course.limitNumber;
              schedule.org = course.org;
              schedule.course = course;
              schedule.schoolDay = curDay.toDate();
              schedule.createdBy = userId;
              schedule.teacher = course.teachers[0];
              const si = await this.scheduleService.createInstance(schedule);
              schedules.push(si);
            }
          }
        }
        curDay = curDay.add(1, 'd');
      }
    }

    const res = await this.scheduleService.batchCreate(schedules);
    if (res) {
      return {
        code: SUCCESS,
        message: `Create schedules successfully. Create ${schedules.length} schedules in total.`,
      };
    }

    return {
      code: SCHEDULE_CREATE_FAIL,
      message: 'Failed to create schedules',
    };
  }

  @Query(() => ScheduleResults)
  async getSchedules(
    @Args('today') today: string,
    @CurOrgId() orgId: string,
  ): Promise<ScheduleResults> {
    const where: FindOptionsWhere<Schedule> = {
      schoolDay: dayjs(today).toDate(),
      org: {
        id: orgId,
      },
    };
    const [results, total] = await this.scheduleService.findAllSchedules({
      where,
    });
    return {
      code: SUCCESS,
      data: results,
      page: {
        total,
      },
      message: 'Get schedule list successfully',
    };
  }

  @Query(() => OrganizationResults, {
    description: 'get courses the current student can subscribe',
  })
  async getCanSubscribeCourses(
    @CurUserId() userId: string,
  ): Promise<OrganizationResults> {
    const cards = await this.cardRecordService.findValidCards(userId);
    if (!cards || cards.length === 0) {
      return {
        code: CARD_RECORD_EXIST,
        message: 'There is no valid consumer card, and please go to buy it.',
      };
    }

    const courses = cards.map((item) => item.course);

    const cs = _.uniqBy(courses, 'id');

    const orgObj: Record<string, OrganizationType> = {}; // { "orgId" :{ name;"", courses:[ ...course ] } }
    for (let i = 0; i < cs.length; i++) {
      const c = cs[i];
      if (orgObj[c.org.id]) {
        orgObj[c.org.id].courses.push(c);
      } else {
        orgObj[c.org.id] = {
          ...c.org,
          courses: [c],
        };
      }
    }

    const orgs: OrganizationType[] = Object.values(orgObj);

    return {
      code: SUCCESS,
      message: 'Get courses the current student can subscribe successfully',
      data: orgs,
      page: {
        total: orgs.length,
      },
    };
  }

  @Query(() => ScheduleResults, {
    description: 'get valid schedules for next 7 days by courseId',
  })
  async getSchedulesByCourse(
    @Args('courseId') courseId: string,
  ): Promise<ScheduleResults> {
    const [entities, count] =
      await this.scheduleService.findValidSchedulesForNext7Days(courseId);

    return {
      code: SUCCESS,
      message: 'Get valid schedules for next 7 days successfully',
      data: entities,
      page: {
        total: count,
      },
    };
  }

  @Mutation(() => Result, {
    description: 'confirm to subscribe schedule for a course',
  })
  async subscribeCourse(
    @Args('scheduleId') scheduleId: string,
    @Args('cardId') cardId: string,
    @CurUserId() userId: string,
  ) {
    const myCard = await this.cardRecordService.findById(cardId);
    if (!myCard) {
      return {
        code: CARD_NOT_EXIST,
        message: 'Card does not exist',
      };
    }

    if (dayjs().isAfter(myCard.endTime)) {
      return {
        code: CARD_EXPIRED,
        message: 'Card is expired',
      };
    }

    if (myCard.card.type === CardType.TIME && myCard.residueTime === 0) {
      return {
        code: CARD_DEPLETE,
        message: 'Card is depleted',
      };
    }

    const schedule = await this.scheduleService.findById(scheduleId);
    if (!schedule) {
      return {
        code: SCHEDULE_NOT_EXIST,
        message: 'Schedule does not exist',
      };
    }

    const isHadSubscribe = await this.scheduleRecordService.isHadSubscribe(
      scheduleId,
      userId,
    );
    if (isHadSubscribe) {
      return {
        code: SCHEDULE_HAD_SUBSCRIBE,
        message: 'Please do not subscribe many times for the same schedule',
      };
    }

    const scheduleRecordId = await this.scheduleRecordService.create({
      subscribeTime: new Date(),
      student: {
        id: userId,
      },
      schedule: {
        id: scheduleId,
      },
      cardRecord: {
        id: cardId,
      },
      course: {
        id: schedule.course.id,
      },
      org: {
        id: schedule.org.id,
      },
    });

    if (!scheduleRecordId) {
      return {
        code: SUBSCRIBE_FAIL,
        message: 'Failed to subscribe',
      };
    }

    if (myCard.card.type === CardType.TIME) {
      const res = await this.cardRecordService.updateById(cardId, {
        residueTime: myCard.residueTime - 1,
      });

      if (res) {
        return {
          code: SUCCESS,
          message: 'Subscribe successfully',
        };
      } else {
        await this.scheduleRecordService.deleteById(scheduleRecordId, userId);
        return {
          code: SUBSCRIBE_FAIL,
          message: 'Failed to subscribe',
        };
      }
    }

    return {
      code: SUCCESS,
      message: 'Subscribe successfully',
    };
  }

  @Mutation(() => Result)
  async deleteSchedule(
    @Args('id') id: string,
    @CurUserId() userId: string,
  ): Promise<Result> {
    const result = await this.scheduleService.findById(id);
    if (result) {
      const delRes = await this.scheduleService.deleteById(id, userId);
      if (delRes) {
        return {
          code: SUCCESS,
          message: 'Delete schedule successfully',
        };
      }
      return {
        code: COURSE_DEL_FAIL,
        message: 'Failed to delete schedule',
      };
    }
    return {
      code: COURSE_NOT_EXIST,
      message: 'Schedule does not exist',
    };
  }
}
