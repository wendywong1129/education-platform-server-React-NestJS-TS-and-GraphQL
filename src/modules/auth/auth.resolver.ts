import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { UserService } from './../user/user.service';
import dayjs from 'dayjs';
import * as md5 from 'md5';
import { Result } from '@/common/dto/result.type';
import {
  ACCOUNT_NOT_EXIST,
  CODE_EXPIRE,
  CODE_NOT_EXIST,
  LOGIN_ERROR,
  SUCCESS,
  REGISTER_ERROR,
  ACCOUNT_EXIST,
} from '@/common/constants/code';
import { JwtService } from '@nestjs/jwt';
import { StudentService } from '../student/student.service';
import { accountAndPwdValidate } from '@/shared/utils';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly studentService: StudentService,
    private readonly jwtService: JwtService,
  ) {}

  @Mutation(() => Result, { description: 'Send sms verification' })
  async sendCodeMsg(@Args('tel') tel: string): Promise<Result> {
    return await this.authService.sendCodeMsg(tel);
  }

  @Mutation(() => Result, { description: 'Login' })
  async login(
    @Args('tel') tel: string,
    @Args('code') code: string,
  ): Promise<Result> {
    const user = await this.userService.findByTel(tel);
    if (!user) {
      return {
        code: ACCOUNT_NOT_EXIST,
        message: 'User does not exist',
      };
    }
    if (!user.codeCreateTimeAt || !user.code) {
      return {
        code: CODE_NOT_EXIST,
        message: 'Code does not exist',
      };
    }
    if (dayjs().diff(dayjs(user.codeCreateTimeAt)) > 60 * 60 * 1000) {
      return {
        code: CODE_EXPIRE,
        message: 'Code is expired',
      };
    }
    if (user.code === code) {
      const token = this.jwtService.sign({
        id: user.id,
      });
      return {
        code: SUCCESS,
        message: 'Login successfully',
        data: token,
      };
    }
    return {
      code: LOGIN_ERROR,
      message: 'Failed to login! Wrong mobile number or verification code',
    };
  }

  @Mutation(() => Result, { description: 'Student Login' })
  async studentLogin(
    @Args('account') account: string,
    @Args('password') password: string,
  ): Promise<Result> {
    const result = accountAndPwdValidate(account, password);
    if (result.code !== SUCCESS) {
      return result;
    }
    const student = await this.studentService.findByAccount(account);
    if (!student) {
      return {
        code: ACCOUNT_NOT_EXIST,
        message: 'User does not exist',
      };
    }
    // console.log('md5(password)', student.password, password);
    // md5 encryption
    if (student.password === password) {
      const token = this.jwtService.sign({
        id: student.id,
      });
      return {
        code: SUCCESS,
        message: 'Login successfully',
        data: token,
      };
    }
    return {
      code: LOGIN_ERROR,
      message: 'Failed to login! Wrong mobile number or verification code',
    };
  }

  @Mutation(() => Result, { description: 'Student Register' })
  async studentRegister(
    @Args('account') account: string,
    @Args('password') password: string,
  ): Promise<Result> {
    const result = accountAndPwdValidate(account, password);
    if (result.code !== SUCCESS) {
      return result;
    }
    const student = await this.studentService.findByAccount(account);
    if (student) {
      return {
        code: ACCOUNT_EXIST,
        message: 'User exists! Please use another account',
      };
    }
    const res = await this.studentService.create({
      account,
      password: md5(password),
    });
    if (res) {
      return {
        code: SUCCESS,
        message: 'Register successfully',
      };
    }
    return {
      code: REGISTER_ERROR,
      message: 'Failed to register',
    };
  }
}
