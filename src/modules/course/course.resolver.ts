import { Course } from './models/course.entity';
import {
  COURSE_CREATE_FAIL,
  COURSE_DEL_FAIL,
  COURSE_NOT_EXIST,
  COURSE_UPDATE_FAIL,
} from './../../common/constants/code';
import { Result } from '@/common/dto/result.type';
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '@/common/guards/auth.guard';
import { SUCCESS } from '@/common/constants/code';
import { CourseResult, CourseResults } from './dto/result-course.output';
import {
  // CourseInput,
  PartialCourseInput,
} from './dto/course.input';
import { CourseType } from './dto/course.type';
import { CourseService } from './course.service';
import { CurUserId } from '@/common/decorators/current-user.decorator';
import { PageInput } from '@/common/dto/page.input';
import { DeepPartial, FindOptionsWhere, Like } from 'typeorm';
import { CurOrgId } from './../../common/decorators/current-org.decorator';

@Resolver(() => CourseType)
@UseGuards(GqlAuthGuard)
export class CourseResolver {
  constructor(private readonly courseService: CourseService) {}

  @Query(() => CourseResult)
  async getCourseInfo(@Args('id') id: string): Promise<CourseResult> {
    const result = await this.courseService.findById(id);
    if (result) {
      return {
        code: SUCCESS,
        data: result,
        message: 'Get course info successfully',
      };
    }
    return {
      code: COURSE_NOT_EXIST,
      message: 'Course info does not exist',
    };
  }

  @Mutation(() => CourseResult)
  async commitCourseInfo(
    @Args('params') params: PartialCourseInput,
    @CurUserId() userId: string,
    @CurOrgId() orgId: string,
    @Args('id', { nullable: true }) id: string,
  ): Promise<Result> {
    if (!id) {
      const res = await this.courseService.create({
        ...params,
        teachers: params.teachers.map((item) => ({ id: item })),
        createdBy: userId,
        org: {
          id: orgId,
        },
      });
      if (res) {
        return {
          code: SUCCESS,
          message: 'Create a course successfully',
        };
      }
      return {
        code: COURSE_CREATE_FAIL,
        message: 'Failed to create a course',
      };
    }
    const course = await this.courseService.findById(id);
    if (course) {
      const courseInput: DeepPartial<Course> = {
        ...params,
        updatedBy: userId,
        teachers: course.teachers,
      };
      if (params.teachers) {
        courseInput.teachers = params.teachers.map((item) => ({ id: item }));
      }
      const res = await this.courseService.updateById(course.id, courseInput);
      if (res) {
        return {
          code: SUCCESS,
          message: 'Update the course successfully',
        };
      }
      return {
        code: COURSE_UPDATE_FAIL,
        message: 'Failed to update the course',
      };
    }
    return {
      code: COURSE_NOT_EXIST,
      message: 'Course info does not exist',
    };
  }

  @Query(() => CourseResults)
  async getCourses(
    @Args('page') page: PageInput,
    @CurUserId() userId: string,
    @CurOrgId() orgId: string,
    @Args('name', { nullable: true }) name?: string,
  ): Promise<CourseResults> {
    const { pageNum, pageSize } = page;
    const where: FindOptionsWhere<Course> = {
      createdBy: userId,
      org: {
        id: orgId,
      },
    };
    if (name) {
      where.name = Like(`%${name}%`);
    }
    const [results, total] = await this.courseService.findCourses({
      start: (pageNum - 1) * pageSize,
      length: pageSize,
      where,
    });
    return {
      code: SUCCESS,
      data: results,
      page: {
        pageNum,
        pageSize,
        total,
      },
      message: 'Get course list successfully',
    };
  }

  @Mutation(() => Result)
  async deleteCourse(
    @Args('id') id: string,
    @CurUserId() userId: string,
  ): Promise<Result> {
    const result = await this.courseService.findById(id);
    if (result) {
      const delRes = await this.courseService.deleteById(id, userId);
      if (delRes) {
        return {
          code: SUCCESS,
          message: 'Delete the course successfully',
        };
      }
      return {
        code: COURSE_DEL_FAIL,
        message: 'Failed to delete the course',
      };
    }
    return {
      code: COURSE_NOT_EXIST,
      message: 'Course info does not exist',
    };
  }
}
