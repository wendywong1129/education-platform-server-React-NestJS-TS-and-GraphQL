import { CurOrgId } from './../../common/decorators/current-org.decorator';
import { FindOptionsWhere, Like } from 'typeorm';
import { Teacher } from './models/teacher.entity';
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
import { TeacherResult, TeacherResults } from './dto/result-teacher.output';
import { TeacherInput } from './dto/teacher.input';
import { TeacherType } from './dto/teacher.type';
import { TeacherService } from './teacher.service';
import { CurUserId } from '@/common/decorators/current-user.decorator';
import { PageInput } from '@/common/dto/page.input';

@Resolver(() => TeacherType)
@UseGuards(GqlAuthGuard)
export class TeacherResolver {
  constructor(private readonly teacherService: TeacherService) {}

  @Query(() => TeacherResult)
  async getTeacherInfo(@Args('id') id: string): Promise<TeacherResult> {
    const result = await this.teacherService.findById(id);
    if (result) {
      return {
        code: SUCCESS,
        data: result,
        message: 'Get teacher info successfully',
      };
    }
    return {
      code: COURSE_NOT_EXIST,
      message: 'Teacher info does not exist',
    };
  }

  @Mutation(() => TeacherResult)
  async commitTeacherInfo(
    @Args('params') params: TeacherInput,
    @CurUserId() userId: string,
    @CurOrgId() orgId: string,
    @Args('id', { nullable: true }) id: string,
  ): Promise<Result> {
    if (!id) {
      const res = await this.teacherService.create({
        ...params,
        createdBy: userId,
        org: {
          id: orgId,
        },
      });
      if (res) {
        return {
          code: SUCCESS,
          message: 'Create a teacher successfully',
        };
      }
      return {
        code: COURSE_CREATE_FAIL,
        message: 'Failed to create a teacher',
      };
    }
    const teacher = await this.teacherService.findById(id);
    if (teacher) {
      const res = await this.teacherService.updateById(teacher.id, {
        ...params,
        updatedBy: userId,
      });
      if (res) {
        return {
          code: SUCCESS,
          message: 'Update the teacher info successfully',
        };
      }
      return {
        code: COURSE_UPDATE_FAIL,
        message: 'Failed to update the teacher info',
      };
    }
    return {
      code: COURSE_NOT_EXIST,
      message: 'Teacher info does not exist',
    };
  }

  @Query(() => TeacherResults)
  async getTeachers(
    @Args('page') page: PageInput,
    @CurUserId() userId: string,
    @CurOrgId() orgId: string,
    @Args('name', { nullable: true }) name?: string,
  ): Promise<TeacherResults> {
    const { pageNum, pageSize } = page;
    const where: FindOptionsWhere<Teacher> = {
      createdBy: userId,
      org: {
        id: orgId,
      },
    };
    if (name) {
      where.name = Like(`%${name}%`);
    }
    const [results, total] = await this.teacherService.findTeachers({
      start: pageNum === 1 ? 0 : (pageNum - 1) * pageSize + 1,
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
      message: 'Get teacher list successfully',
    };
  }

  @Mutation(() => Result)
  async deleteTeacher(
    @Args('id') id: string,
    @CurUserId() userId: string,
  ): Promise<Result> {
    const result = await this.teacherService.findById(id);
    if (result) {
      const delRes = await this.teacherService.deleteById(id, userId);
      if (delRes) {
        return {
          code: SUCCESS,
          message: 'Delete teacher info successfully',
        };
      }
      return {
        code: COURSE_DEL_FAIL,
        message: 'Failed to delete the teacher info',
      };
    }
    return {
      code: COURSE_NOT_EXIST,
      message: 'Teacher info does not exist',
    };
  }
}
