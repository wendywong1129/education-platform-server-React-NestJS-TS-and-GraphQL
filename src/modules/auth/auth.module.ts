import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, ConsoleLogger } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { User } from '../user/models/user.entity';
import { UserService } from '../user/user.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { Student } from '../student/models/student.entity';
import { StudentService } from '../student/student.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: 60 * 60 * 24 * 7 + 's',
      },
    }),
    TypeOrmModule.forFeature([User, Student]),
  ],
  providers: [
    JwtStrategy,
    ConsoleLogger,
    AuthResolver,
    AuthService,
    UserService,
    StudentService,
  ],
  exports: [],
})
export class AuthModule {}
