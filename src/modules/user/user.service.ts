import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { User } from './models/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private UserRepository: Repository<User>,
  ) {}

  // Create a new user
  async create(entity: DeepPartial<User>): Promise<boolean> {
    const res = await this.UserRepository.insert(entity);
    if (res && res.raw.affectedRows > 0) {
      return true;
    }
    return false;
  }

  // delete a user by id
  async del(id: string): Promise<boolean> {
    const res = await this.UserRepository.delete(id);
    if (res.affected > 0) {
      return true;
    }
    return false;
  }

  // update a user by id
  async update(id: string, entity: DeepPartial<User>): Promise<boolean> {
    const res = await this.UserRepository.update(id, entity);
    if (res.affected > 0) {
      return true;
    }
    return false;
  }

  // find a user by id
  async find(id: string): Promise<User> {
    const res = await this.UserRepository.findOne({
      where: {
        id,
      },
    });
    return res;
  }

  // find a user by tel
  async findByTel(tel: string): Promise<User> {
    const res = await this.UserRepository.findOne({
      where: {
        tel,
      },
    });
    return res;
  }

  // update user's code
  async updateCode(id: string, code: string): Promise<boolean> {
    const res = await this.UserRepository.update(id, {
      code,
      codeCreateTimeAt: new Date(),
    });
    if (res.affected > 0) {
      return true;
    }
    return false;
  }
}
