import { FindOptionsWhere } from 'typeorm';
import { Order } from './models/order.entity';
import { ORDER_DEL_FAIL, ORDER_NOT_EXIST } from './../../common/constants/code';
import { Result } from '@/common/dto/result.type';
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '@/common/guards/auth.guard';
import { SUCCESS } from '@/common/constants/code';
import { OrderResult, OrderResults } from './dto/result-order.output';
import { OrderType } from './dto/order.type';
import { OrderService } from './order.service';
import { CurUserId } from '@/common/decorators/current-user.decorator';
import { PageInput } from '@/common/dto/page.input';

@Resolver(() => OrderType)
@UseGuards(GqlAuthGuard)
export class OrderResolver {
  constructor(private readonly orderService: OrderService) {}

  @Query(() => OrderResult)
  async getOrderInfo(@Args('id') id: string): Promise<OrderResult> {
    const result = await this.orderService.findById(id);
    if (result) {
      return {
        code: SUCCESS,
        data: result,
        message: 'Get order info successfully',
      };
    }
    return {
      code: ORDER_NOT_EXIST,
      message: 'Order info does not exist',
    };
  }

  @Query(() => OrderResults)
  async getOrders(
    @Args('page') page: PageInput,
    @CurUserId() userId: string,
  ): Promise<OrderResults> {
    const { pageNum, pageSize } = page;
    const where: FindOptionsWhere<Order> = { createdBy: userId };
    const [results, total] = await this.orderService.findOrders({
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
      message: 'Get order list successfully',
    };
  }

  @Mutation(() => Result)
  async deleteOrder(
    @Args('id') id: string,
    @CurUserId() userId: string,
  ): Promise<Result> {
    const result = await this.orderService.findById(id);
    if (result) {
      const delRes = await this.orderService.deleteById(id, userId);
      if (delRes) {
        return {
          code: SUCCESS,
          message: 'Delete the order successfully',
        };
      }
      return {
        code: ORDER_DEL_FAIL,
        message: 'Failed to delete the order',
      };
    }
    return {
      code: ORDER_NOT_EXIST,
      message: 'Order info does not exist',
    };
  }
}
