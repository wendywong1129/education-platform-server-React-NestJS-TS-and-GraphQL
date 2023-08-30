import { Result } from '@/common/dto/result.type';
import {
  Args,
  Mutation,
  Resolver,
  // Context,
  Query,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '@/common/guards/auth.guard';
import { SUCCESS, STUDENT_NOT_EXIST } from '@/common/constants/code';
import { StudentResult, StudentResults } from './dto/result-student.output';
import { StudentInput } from './dto/student.input';
import { StudentType } from './dto/student.type';
import { StudentService } from './student.service';
import { CurUserId } from '@/common/decorators/current-user.decorator';
import { PageInput } from '@/common/dto/page.input';

@Resolver(() => StudentType)
@UseGuards(GqlAuthGuard)
export class StudentResolver {
  constructor(private readonly studentService: StudentService) {}

  @Query(() => StudentResult)
  async getStudentInfo(@CurUserId() userId: string): Promise<StudentResult> {
    // const id = cxt.req.user.id;
    // const result = await this.studentService.findById(id);
    const result = await this.studentService.findById(userId);
    if (result) {
      return {
        code: SUCCESS,
        data: result,
        message: 'Get student info successfully',
      };
    }
    return {
      code: STUDENT_NOT_EXIST,
      message: 'Student does not exist',
    };
  }

  @Mutation(() => StudentResult)
  async commitStudentInfo(
    @Args('params') params: StudentInput,
    @CurUserId() userId: string,
  ): Promise<Result> {
    // const id = cxt.req.user.id;
    // const student = await this.studentService.findById(id);
    const student = await this.studentService.findById(userId);
    if (student) {
      const res = await this.studentService.updateById(student.id, params);
      if (res) {
        return {
          code: SUCCESS,
          message: 'Update student info successfully',
        };
      }
    }
    return {
      code: STUDENT_NOT_EXIST,
      message: 'Student info does not exist',
    };
  }

  @Query(() => StudentResults)
  async getStudents(@Args('page') page: PageInput): Promise<StudentResults> {
    // const { start, length } = page;
    const { pageNum, pageSize } = page;
    const [results, total] = await this.studentService.findStudents({
      // start,
      // length,
      start: (pageNum - 1) * pageSize,
      length: pageSize,
    });
    return {
      code: SUCCESS,
      data: results,
      page: {
        // start,
        // length,
        pageNum,
        pageSize,
        total,
      },
      message: 'Get student list successfully',
    };
  }
}
