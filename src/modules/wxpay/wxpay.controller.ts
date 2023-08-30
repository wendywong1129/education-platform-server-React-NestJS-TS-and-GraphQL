import {
  // Body,
  Controller,
  Get,
  // Inject,
  // Post,
  Query,
  Res,
} from '@nestjs/common';
import axios from 'axios';
import { StudentService } from '../student/student.service';
// import { IWxpayResult } from './dto/wxpay-result.type';
// import WxPay from 'wechatpay-node-v3';
// import { WECHAT_PAY_MANAGER } from 'nest-wechatpay-node-v3';
// import { OrderStatus } from '@/common/constants/enmu';
import { OrderService } from '../order/order.service';
import { WxorderService } from '../wxorder/wxorder.service';
import { CardRecordService } from '../cardRecord/card-record.service';
import { ProductService } from '../product/product.service';
// import { WxorderType } from '../wxorder/dto/wxorder.type';

@Controller('wx')
export class WxpayController {
  constructor(
    private readonly studentService: StudentService,
    private readonly orderService: OrderService,
    private readonly wxorderService: WxorderService,
    private readonly cardRecordService: CardRecordService,
    private readonly productService: ProductService, // @Inject(WECHAT_PAY_MANAGER) private wxPay: WxPay,
  ) {}

  // @Post('wxpayResult')
  // async wxpayResult(@Body() data: IWxpayResult) {
  //   // const result: {
  //   //   trade_state: string;
  //   //   out_trade_no: string;
  //   // } = this.wxPay.decipher_gcm(
  //   // const result: WxorderType = this.wxPay.decipher_gcm(
  //   const result: WxorderType & {
  //     payer: {
  //       openid: string;
  //     };
  //     amount: {
  //       total: number;
  //       payer_total: number;
  //       currency: string;
  //       payer_currency: string;
  //     };
  //   } = this.wxPay.decipher_gcm(
  //     data.resource.ciphertext,
  //     data.resource.associated_data,
  //     data.resource.nonce,
  //     process.env.WXPAY_APIV3KEY,
  //   );

  //   const order = await this.orderService.findByOutTradeNo(result.out_trade_no);

  //   if (order && order.status === OrderStatus.USERPAYING) {
  //     let wxOrder = await this.wxorderService.findByTransactionId(
  //       result.transaction_id,
  //     );

  //     if (!wxOrder) {
  //       // wxOrder = await this.wxorderService.create(result);
  //       wxOrder = await this.wxorderService.create({
  //         ...result,
  //         ...result.payer,
  //         ...result.amount,
  //         org: {
  //           id: order.org.id,
  //         },
  //       });
  //     }

  //     if (wxOrder) {
  //       const product = await this.productService.findById(order.product.id);
  //       const res = await this.cardRecordService.addCardForStudent(
  //         order.student.id,
  //         product.cards.map((item) => item.id),
  //       );
  //       if (res) {
  //         await this.orderService.updateById(order.id, {
  //           status: result.trade_state,
  //           // associated wxOrder info
  //           wxOrder: wxOrder,
  //         });
  //       }
  //     }
  //   }

  //   return {
  //     code: 'SUCCESS',
  //     message: 'Success',
  //   };
  // }

  // /wx/login
  @Get('login')
  async wxLogin(
    @Query('userId') userId: string,
    @Query('url') url: string,
    @Res() res,
  ): Promise<void> {
    res.redirect(`
      https://open.weixin.qq.com/connect/oauth2/authorize?appid=${
        process.env.WXPAY_APPID
      }&redirect_uri=${
      process.env.WXPAY_URL
    }/wx/wxCode&response_type=code&scope=snsapi_base&state=${userId}@${encodeURIComponent(
      url,
    )}#wechat_redirect
    `);
  }

  // /wx/wxCode
  @Get('wxCode')
  async wxCode(
    @Res() res,
    @Query('code') code: string,
    @Query('state') state: string,
  ) {
    const [userId, url] = state.split('@');
    const response = await axios.get(
      `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${process.env.WXPAY_APPID}&secret=${process.env.WXPAY_APPSECRET}&code=${code}&grant_type=authorization_code`,
    );
    const { openid } = response.data;
    await this.studentService.updateById(userId, {
      openid,
    });
    res.redirect(decodeURIComponent(url));
  }
}
