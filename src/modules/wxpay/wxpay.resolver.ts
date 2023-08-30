import { StudentService } from './../student/student.service';
import { CurUserId } from '@/common/decorators/current-user.decorator';
import { GqlAuthGuard } from '@/common/guards/auth.guard';
import {
  // Inject,
  UseGuards,
} from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { WxConfigResult } from './dto/result-wxpay.output';
import {
  NOT_OPENID,
  PRODUCT_NOT_EXIST,
  SUCCESS,
} from '@/common/constants/code';
// import WxPay from 'wechatpay-node-v3';
// import { WECHAT_PAY_MANAGER } from 'nest-wechatpay-node-v3';
import { v4 as uuidv4 } from 'uuid';
import { ProductService } from '../product/product.service';
import { WxConfig } from './dto/wx-config.type';
import { OrderService } from '../order/order.service';
import { OrderStatus } from '@/common/constants/enmu';
import { Result } from '@/common/dto/result.type';
import { CardRecordService } from '../cardRecord/card-record.service';

@Resolver()
@UseGuards(GqlAuthGuard)
export class WxpayResolver {
  constructor(
    private readonly studentService: StudentService,
    private readonly productService: ProductService,
    private readonly orderService: OrderService,
    private readonly cardRecordService: CardRecordService, // @Inject(WECHAT_PAY_MANAGER) private wxPay: WxPay,
  ) {}

  // appId: 'wx2421b1c4370ec43b',
  // timeStamp: '1395712654',
  // nonceStr: 'e61463f8efa94090b1f366cccfbbb444',
  // package: 'prepay_id=up_wx21201855730335ac86f8c43d1889123400',
  // signType: 'RSA',
  // paySign: 'oR9d8PuhnIc+YZ8cBHFCwfgpaK9gd7vaRvkYD7rthRAZ\/X+QBhcCYL21N7cHCTUxbQ+EAt6Uy+lwSN22f5YZvI45MLko8Pfso0jm46v5hqcVwrk6uddkGuT+Cdvu4WBqDzaDjnNa5UK3GfE1Wfl2gHxIIY5lLdUgWFts17D4WuolLLkiFZV+JSHMvH7eaLdT9N5GBovBwu5yYKUR7skR8Fu+LozcSqQixnlEZUfyE55feLOQTUYzLmR9pNtPbPsu6WVhbNHMS3Ss2+AehHvz+n64GDmXxbX++IOBvm2olHu3PsOUGRwhudhVf7UcGcunXt8cqNjKNqZLhLw4jq\/xDg==',
  @Mutation(() => WxConfigResult)
  async getWxpayConfig(
    @CurUserId() userId,
    @Args('productId') productId: string,
    @Args('quantity') quantity: number,
    @Args('amount') amount: number,
  ): Promise<WxConfigResult> {
    const student = await this.studentService.findById(userId);
    const product = await this.productService.findById(productId);

    if (!product) {
      return {
        code: PRODUCT_NOT_EXIST,
        message: 'Cannot find the product',
      };
    }

    if (!student || !student.openid) {
      return {
        code: NOT_OPENID,
        message: 'Cannot find the OPENID',
      };
    }

    const outTradeNo = uuidv4().replace(/-/g, '');
    const params = {
      description: product.name,
      out_trade_no: outTradeNo,
      notify_url: process.env.WXPAY_URL + '/wx/wxpayResult',
      amount: {
        total: amount,
      },
      payer: {
        openid: student.openid,
      },
    };
    // const result = await this.wxPay.transactions_jsapi(params);
    const result = {
      appId: 'wx2421b1c4370ec43b',
      timeStamp: '1395712654',
      nonceStr: 'e61463f8efa94090b1f366cccfbbb444',
      package: 'prepay_id=up_wx21201855730335ac86f8c43d1889123400',
      signType: 'RSA',
      paySign:
        'oR9d8PuhnIc+YZ8cBHFCwfgpaK9gd7vaRvkYD7rthRAZ/X+QBhcCYL21N7cHCTUxbQ+EAt6Uy+lwSN22f5YZvI45MLko8Pfso0jm46v5hqcVwrk6uddkGuT+Cdvu4WBqDzaDjnNa5UK3GfE1Wfl2gHxIIY5lLdUgWFts17D4WuolLLkiFZV+JSHMvH7eaLdT9N5GBovBwu5yYKUR7skR8Fu+LozcSqQixnlEZUfyE55feLOQTUYzLmR9pNtPbPsu6WVhbNHMS3Ss2+AehHvz+n64GDmXxbX++IOBvm2olHu3PsOUGRwhudhVf7UcGcunXt8cqNjKNqZLhLw4jq/xDg==',
    };

    await this.orderService.create({
      tel: student.tel,
      quantity,
      amount,
      outTradeNo,
      product: {
        id: productId,
      },
      org: {
        id: product.org.id,
      },
      student: {
        id: userId,
      },
      status: OrderStatus.USERPAYING,
    });

    return {
      code: SUCCESS,
      data: result as WxConfig,
      message: 'Get WePay config info successfully',
    };
  }

  @Mutation(() => Result)
  async mockOrderGenerator(
    @CurUserId() userId: string,
    @Args('productId') productId: string,
    @Args('quantity') quantity: number,
    @Args('amount') amount: number,
  ): Promise<Result> {
    const student = await this.studentService.findById(userId);

    const product = await this.productService.findById(productId);

    const outTradeNo = uuidv4().replace(/-/g, '');

    await this.orderService.create({
      tel: student.tel,
      outTradeNo,
      quantity,
      amount,
      product: {
        id: productId,
      },
      org: {
        id: product.org.id,
      },
      student: {
        id: userId,
      },
      status: OrderStatus.SUCCESS,
      wxOrder: {
        mchid: '123123123',
        appid: 'wx321321321321',
        out_trade_no: outTradeNo,
        transaction_id: 'transaction' + outTradeNo,
        trade_type: 'JSAPI',
        trade_state: 'SUCCESS',
        trade_state_desc: '支付成功',
        bank_type: 'OTHERS',
        attach: '',
        success_time: '2023-08-23T00:48:25+08:00',
        openid: '686868686868',
        total: amount,
        payer_total: amount,
        currency: 'AUD',
        payer_currency: 'AUD',
        org: {
          id: product.org.id,
        },
      },
    });

    await this.cardRecordService.addCardForStudent(
      userId,
      product.cards.map((item) => item.id),
    );

    return {
      code: SUCCESS,
      message: 'Successful Purchase',
    };
  }
}
