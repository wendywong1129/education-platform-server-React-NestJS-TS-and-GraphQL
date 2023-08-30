import { Result } from '@/common/dto/result.type';
import {
  Args,
  Mutation,
  Resolver,
  // Context,
  Query,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '@/common/guards/auth.guard';
import {
  SUCCESS,
  ORG_NOT_EXIST,
  ORG_FAIL,
  ORG_DEL_FAIL,
} from '@/common/constants/code';
import {
  OrganizationResult,
  OrganizationResults,
} from './dto/result-organization.output';
import { OrganizationInput } from './dto/organization.input';
import { OrganizationType } from './dto/organization.type';
import { OrganizationService } from './organization.service';
import { OrgImageService } from './../orgImage/orgImage.service';
import { CurUserId } from '@/common/decorators/current-user.decorator';
import { PageInput } from '@/common/dto/page.input';
import { FindOptionsWhere, Like } from 'typeorm';
import { Organization } from './models/organization.entity';

@Resolver(() => OrganizationType)
@UseGuards(GqlAuthGuard)
export class OrganizationResolver {
  constructor(
    private readonly organizationService: OrganizationService,
    private readonly orgImageService: OrgImageService,
  ) {}

  @Query(() => OrganizationResult)
  async getOrganizationInfo(
    @Args('id') id: string,
  ): Promise<OrganizationResult> {
    const result = await this.organizationService.findById(id);
    if (result) {
      return {
        code: SUCCESS,
        data: result,
        message: 'Get organization info successfully',
      };
    }
    return {
      code: ORG_NOT_EXIST,
      message: 'Organization info does not exist',
    };
  }

  // @Mutation(() => OrganizationResult)
  // async commitOrganizationInfo(
  //   @Args('params') params: OrganizationInput,
  //   @CurUserId() userId: string,
  // ): Promise<Result> {
  //   // const id = cxt.req.user.id;
  //   // const Organization = await this.OrganizationService.findById(id);
  //   const Organization = await this.organizationService.findById(userId);
  //   if (Organization) {
  //     const res = await this.organizationService.updateById(
  //       Organization.id,
  //       params,
  //     );
  //     if (res) {
  //       return {
  //         code: SUCCESS,
  //         message: 'Update organization info successfully',
  //       };
  //     }
  //   }
  //   return {
  //     code: ORG_NOT_EXIST,
  //     message: 'Organization info does not exist',
  //   };
  // }
  @Mutation(() => OrganizationResult)
  async commitOrganization(
    @Args('params') params: OrganizationInput,
    @CurUserId() userId: string,
    @Args('id', { nullable: true }) id?: string,
  ): Promise<Result> {
    if (id) {
      const organization = await this.organizationService.findById(id);
      if (!organization) {
        return {
          code: ORG_NOT_EXIST,
          message: 'Organization info does not exist',
        };
      }
      const delRes = await this.orgImageService.deleteByOrg(id);
      if (!delRes) {
        return {
          code: ORG_FAIL,
          message:
            'Failed to delete image and  cannot update organization info',
        };
      }
      const res = await this.organizationService.updateById(id, {
        ...params,
        updatedBy: userId,
      });
      if (res) {
        return {
          code: SUCCESS,
          message: 'Update organization info successfully',
        };
      }
    }
    const res = await this.organizationService.create({
      ...params,
      createdBy: userId,
    });
    if (res) {
      return {
        code: SUCCESS,
        message: 'Create an organization successfully',
      };
    }
    return {
      code: ORG_FAIL,
      message: 'Failed to do the operation',
    };
  }

  @Query(() => OrganizationResults)
  async getOrganizations(
    @Args('page') page: PageInput,
    @CurUserId() userId: string,
    @Args('name', { nullable: true }) name?: string,
  ): Promise<OrganizationResults> {
    // const { start, length } = page;
    const { pageNum, pageSize } = page;
    const where: FindOptionsWhere<Organization> = { createdBy: userId };
    if (name) {
      where.name = Like(`%${name}%`);
    }
    const [results, total] = await this.organizationService.findOrganizations({
      // start,
      // length,
      start: (pageNum - 1) * pageSize,
      length: pageSize,
      where,
    });
    return {
      code: SUCCESS,
      data: results,
      page: {
        // start,
        // length,
        pageNum,
        pageSize,
        total,
      },
      message: 'Get Organization list successfully',
    };
  }

  @Mutation(() => Result)
  async deleteOrganization(
    @Args('id') id: string,
    @CurUserId() userId: string,
  ): Promise<Result> {
    const result = await this.organizationService.findById(id);
    if (result) {
      const delRes = await this.organizationService.deleteById(id, userId);
      if (delRes) {
        return {
          code: SUCCESS,
          message: 'Delete the organization successfully',
        };
      }
      return {
        code: ORG_DEL_FAIL,
        message: 'Failed to delete the organization',
      };
    }
    return {
      code: ORG_NOT_EXIST,
      message: 'Organization info does not exist',
    };
  }
}
