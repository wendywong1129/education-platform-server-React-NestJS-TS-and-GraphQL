import { SUCCESS } from '@/common/constants/code';
import { NOT_EMPTY, VALIDATE_ERROR } from './../../common/constants/code';
import { Result } from '@/common/dto/result.type';

export const getRandomCode = () => {
  const code = [];
  for (let i = 0; i < 4; i++) {
    code.push(Math.floor(Math.random() * 9));
  }
  return code.join('');
};

/**
 * @param account
 * @param password
 */
export const accountAndPwdValidate = (
  account: string,
  password: string,
): Result => {
  if (!account || !password) {
    return {
      code: NOT_EMPTY,
      message: 'Username or password cannot be empty',
    };
  }
  if (!/^(?![0-9]+$)(?![a-z]+$)[a-z0-9]{6,10}$/.test(account)) {
    return {
      code: VALIDATE_ERROR,
      message: 'Failed to verify account, please input account info again',
    };
  }
  return {
    code: SUCCESS,
  };
};

export const getEnvConfig = () =>
  process.env.NODE_ENV === 'development' ? '.env' : '/etc/server.conf/.env';
