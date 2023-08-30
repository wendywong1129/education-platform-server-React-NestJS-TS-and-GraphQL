import { Args, Mutation, Resolver, Query, Context } from '@nestjs/graphql';
import { UserService } from './user.service';
import { UserInput } from './dto/user-input.type';
import { UserType } from './dto/user.type';
import { GqlAuthGuard } from '@/common/guards/auth.guard';
import { UseGuards } from '@nestjs/common';
import { Result } from '@/common/dto/result.type';
import { SUCCESS, UPDATE_ERROR } from '@/common/constants/code';

@Resolver()
@UseGuards(GqlAuthGuard)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => Boolean, {
    name: 'createUser',
    description: 'create a new user',
  })
  async create(@Args('params') params: UserInput): Promise<boolean> {
    return await this.userService.create(params);
  }

  @Query(() => UserType, { name: 'findById', description: 'find a user by id' })
  async find(@Args('id') id: string): Promise<UserType> {
    return await this.userService.find(id);
  }

  @Query(() => UserType, { description: 'get user info by user id' })
  async getUserInfo(@Context() cxt: any): Promise<UserType> {
    const id = cxt.req.user.id;
    return await this.userService.find(id);
  }

  @Mutation(() => Boolean, {
    name: 'updateById',
    description: 'update a user by id',
  })
  async update(
    @Args('id') id: string,
    @Args('params') params: UserInput,
  ): Promise<boolean> {
    return await this.userService.update(id, params);
  }

  @Mutation(() => Result, { description: 'update user info by user id' })
  async updateUserInfo(
    @Args('id') id: string,
    @Args('params') params: UserInput,
  ): Promise<Result> {
    const res = await this.userService.update(id, params);
    if (res) {
      return {
        code: SUCCESS,
        message: 'Update user info successfully',
      };
    }
    return {
      code: UPDATE_ERROR,
      message: 'Failed to update user info',
    };
  }

  @Mutation(() => Boolean, {
    name: 'deleteById',
    description: 'delete a user by id',
  })
  async del(@Args('id') id: string): Promise<boolean> {
    return await this.userService.del(id);
  }
}
