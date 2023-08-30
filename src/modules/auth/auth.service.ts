import { Injectable } from '@nestjs/common';
import * as Dysmsapi from '@alicloud/dysmsapi20180501';
import Util, * as utils from '@alicloud/tea-util';
import { getRandomCode } from '@/shared/utils';
import { UserService } from '../user/user.service';
import { msgClient } from '@/shared/utils/msg';
import * as dayjs from 'dayjs';
import { Result } from '@/common/dto/result.type';
import {
  CODE_NOT_EXPIRE,
  SUCCESS,
  UPDATE_ERROR,
} from '@/common/constants/code';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  // send short message code
  async sendCodeMsg(tel: string): Promise<Result> {
    const user = await this.userService.findByTel(tel);
    if (user) {
      const diffTime = dayjs().diff(dayjs(user.codeCreateTimeAt));
      if (diffTime < 60 * 1000) {
        return {
          code: CODE_NOT_EXPIRE,
          message: 'Code is not expired',
        };
      }
    }
    const code = getRandomCode();
    const sendMessageToGlobeRequest = new Dysmsapi.SendMessageToGlobeRequest({
      to: tel,
      message: `[IT RUN] Your verification code is ${code}`,
    });
    const runtime = new utils.RuntimeOptions({});
    try {
      // Copy the code to run, please print the return value of the API by yourself.
      await msgClient.sendMessageToGlobeWithOptions(
        sendMessageToGlobeRequest,
        runtime,
      );
      if (user) {
        const result = await this.userService.updateCode(user.id, code);
        if (result) {
          return {
            code: SUCCESS,
            message: 'Code has been sent!',
          };
        }
        return { code: UPDATE_ERROR, message: 'Failed to update code' };
      }
      const result = await this.userService.create({
        tel,
        code,
        codeCreateTimeAt: new Date(),
      });
      if (result) {
        return {
          code: SUCCESS,
          message: 'OK',
        };
      }
      return { code: UPDATE_ERROR, message: 'Failed to create an user' };
    } catch (error) {
      // Print error if needed.
      Util.assertAsString(error.message);
    }
  }
}
