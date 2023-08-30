import { Controller, Get } from '@nestjs/common';
import { User } from './modules/user/models/user.entity';
import { UserService } from './modules/user/user.service';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly userService: UserService,
    private readonly appService: AppService,
  ) {}

  @Get('/test')
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/create')
  async create(): Promise<boolean> {
    return await this.userService.create({
      name: 'admin',
      desc: 'admin',
      tel: '61-0401234567',
      // password: '123456',
      // account: 'admin',
    });
  }

  @Get('/del')
  async del(): Promise<boolean> {
    return await this.userService.del('7ee9abc5-33a9-40ba-97db-78765b79e5c0');
  }

  @Get('/update')
  async update(): Promise<boolean> {
    return await this.userService.update(
      'cfe1bf89-e856-4927-a1d4-bfe7213f0e6e',
      {
        name: 'adminSuper',
      },
    );
  }

  @Get('/find')
  async find(id: string): Promise<User> {
    return await this.userService.find(id);
  }
}
