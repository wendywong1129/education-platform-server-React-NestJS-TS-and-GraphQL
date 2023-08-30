import Dysmsapi20180501 from '@alicloud/dysmsapi20180501';
import * as OpenApi from '@alicloud/openapi-client';
import { config } from 'dotenv';
// import { getEnvConfig } from '.';

config();
// config({
//   path: getEnvConfig(),
// });

const conf = new OpenApi.Config({
  // Required, your AccessKey ID
  accessKeyId: process.env.ACCESS_KEY,
  // Required, your AccessKey secret
  accessKeySecret: process.env.ACCESS_KEY_SECRET,
});
// See https://api.alibabacloud.com/product/Dysmsapi.
conf.endpoint = `dysmsapi.ap-southeast-1.aliyuncs.com`;
export const msgClient = new Dysmsapi20180501(conf);
