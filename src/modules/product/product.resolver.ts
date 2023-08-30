import { CurOrgId } from './../../common/decorators/current-org.decorator';
import { FindOptionsWhere, Like } from 'typeorm';
import { Product } from './models/product.entity';
import {
  PRODUCT_CREATE_FAIL,
  PRODUCT_DEL_FAIL,
  PRODUCT_NOT_EXIST,
  PRODUCT_UPDATE_FAIL,
} from './../../common/constants/code';
import { Result } from '@/common/dto/result.type';
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '@/common/guards/auth.guard';
import { SUCCESS } from '@/common/constants/code';
import {
  ProductResult,
  ProductResults,
  ProductTypesResults,
} from './dto/result-product.output';
import { PartialProductInput } from './dto/product.input';
import { ProductType } from './dto/product.type';
import { ProductService } from './product.service';
import { CurUserId } from '@/common/decorators/current-user.decorator';
import { PageInput } from '@/common/dto/page.input';
import { PRODUCT_TYPES } from '@/common/constants/product-types';
import { ProductStatus } from '@/common/constants/enmu';

@Resolver(() => ProductType)
@UseGuards(GqlAuthGuard)
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  @Query(() => ProductTypesResults)
  async getProductTypes(): Promise<ProductTypesResults> {
    return {
      code: SUCCESS,
      data: PRODUCT_TYPES,
      message: 'Get product types successfully',
    };
  }

  @Query(() => ProductResult)
  async getProductInfo(@Args('id') id: string): Promise<ProductResult> {
    const result = await this.productService.findById(id);

    if (result) {
      return {
        code: SUCCESS,
        data: result,
        message: 'Get product info successfully',
      };
    }

    return {
      code: PRODUCT_NOT_EXIST,
      message: 'Product info does not exist',
    };
  }

  @Mutation(() => ProductResult)
  async commitProductInfo(
    @Args('params') params: PartialProductInput,
    @CurUserId() userId: string,
    @CurOrgId() orgId: string,
    @Args('id', { nullable: true }) id: string,
  ): Promise<Result> {
    if (!id) {
      const res = await this.productService.create({
        ...params,
        createdBy: userId,
        cards: [],
        curStock: params.stock,
        status: ProductStatus.UN_LIST,
        org: {
          id: orgId,
        },
      });

      if (res) {
        return {
          code: SUCCESS,
          message: 'Create a product successfully',
        };
      }

      return {
        code: PRODUCT_CREATE_FAIL,
        message: 'Failed to create a product',
      };
    }

    const product = await this.productService.findById(id);

    if (product) {
      const newProduct = {
        ...params,
        cards: [],
        updatedBy: userId,
      };

      if (params.cards && params.cards?.length > 0) {
        newProduct.cards = params.cards.map((item) => ({
          id: item,
        }));
      } else {
        newProduct.cards = product.cards;
      }

      const res = await this.productService.updateById(product.id, newProduct);

      if (res) {
        return {
          code: SUCCESS,
          message: 'Update the product successfully',
        };
      }

      return {
        code: PRODUCT_UPDATE_FAIL,
        message: 'Failed to update the product',
      };
    }

    return {
      code: PRODUCT_NOT_EXIST,
      message: 'Product info does not exist',
    };
  }

  @Query(() => ProductResults)
  async getProducts(
    @Args('page') page: PageInput,
    @CurUserId() userId: string,
    @CurOrgId() orgId: string,
    @Args('name', { nullable: true }) name?: string,
  ): Promise<ProductResults> {
    const { pageNum, pageSize } = page;

    const where: FindOptionsWhere<Product> = { createdBy: userId };

    if (name) {
      where.name = Like(`%${name}%`);
    }

    if (orgId) {
      where.org = {
        id: orgId,
      };
    }

    const [results, total] = await this.productService.findProducts({
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
      message: 'Get product list successfully',
    };
  }

  @Mutation(() => Result)
  async deleteProduct(
    @Args('id') id: string,
    @CurUserId() userId: string,
  ): Promise<Result> {
    const result = await this.productService.findById(id);

    if (result) {
      const delRes = await this.productService.deleteById(id, userId);

      if (delRes) {
        return {
          code: SUCCESS,
          message: 'Delete the product successfully',
        };
      }

      return {
        code: PRODUCT_DEL_FAIL,
        message: 'Failed to delete the product',
      };
    }

    return {
      code: PRODUCT_NOT_EXIST,
      message: 'Product info does not exist',
    };
  }

  @Query(() => ProductResults)
  async getProductsForH5(
    @Args('page') page: PageInput,
    // @Args('latitude') latitude: number,
    // @Args('longitude') longitude: number,
    @Args('type', { nullable: true }) type?: string,
    @Args('name', { nullable: true }) name?: string,
  ): Promise<ProductResults> {
    const { pageNum, pageSize } = page;

    const where: FindOptionsWhere<Product> = {
      status: ProductStatus.LIST,
    };

    if (name) {
      // where.name = Like(`%${name}%`);
      where.name = name;
    }

    if (type) {
      where.type = type;
    }

    const [results, total] = await this.productService.findProducts({
      start: (pageNum - 1) * pageSize,
      length: pageSize,
      where,
    });

    // const { entities, raw } =
    //   await this.productService.findProductsOrderByDistance({
    //     start: (pageNum - 1) * pageSize,
    //     length: pageSize,
    //     where,
    //     position: {
    //       latitude,
    //       longitude,
    //     },
    //   });

    // const total = await this.productService.getCount({
    //   where,
    // });

    return {
      code: SUCCESS,
      // data: results,
      data: results.map((item) => {
        const distance = Math.random() * 10000;
        // data: entities.map((item, index) => {
        //   const distance = raw[index].distance;
        let distanceLabel = '>5km';
        if (distance < 1000 && distance > 0) {
          distanceLabel = `${parseInt(distance.toString(), 10)}m`;
        }
        if (distance >= 1000) {
          distanceLabel = `${parseInt((distance / 100).toString(), 10) / 10}km`;
        }
        if (distance > 5000) {
          distanceLabel = '>5km';
        }
        return {
          ...item,
          distance: distanceLabel,
        };
      }),
      page: {
        pageNum,
        pageSize,
        total,
      },
      message: 'Get products for H5 successfully',
    };
  }

  @Query(() => ProductResults)
  async getProductsByOrgIdForH5(@Args('orgId') orgId: string) {
    const [results] = await this.productService.findProducts({
      start: 0,
      length: 5,
      where: {
        org: {
          id: orgId,
        },
        status: ProductStatus.LIST,
      },
    });
    return {
      code: SUCCESS,
      data: results,
      message: 'Get products by orgId for H5 successfully',
    };
  }
}
