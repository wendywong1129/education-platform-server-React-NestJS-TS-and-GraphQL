import { Field, ObjectType } from '@nestjs/graphql';

// appId: 'wx2421b1c4370ec43b',
// timeStamp: new Date().getMilliseconds(),
// nonceStr: 'e61463f8efa94090b1f366cccfbbb444',
// package: 'prepay_id=u802345jgfjsdfgsdg888',
// signType: 'MD5',
// paySign: '70EA570631E4BB79628FBCA90534C63FF7FADD89',
@ObjectType()
export class WxConfig {
  @Field({
    description: 'appId',
  })
  appId: string;

  @Field({
    description: 'timeStamp',
  })
  timeStamp: string;

  @Field({
    description: 'random string',
  })
  nonceStr: string;

  @Field({
    description: 'package',
  })
  package: string;

  @Field({
    description: 'sign type',
  })
  signType: string;

  @Field({
    description: 'pay sign',
  })
  paySign: string;
}
