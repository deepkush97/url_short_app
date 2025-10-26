import { BcryptModule } from '@app/shared/bcrypt/bcrypt.module';
import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { UsersService } from '../user/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [UserModule, BcryptModule],
  controllers: [AuthController],
  providers: [AuthService, UsersService],
})
export class AuthModule {}
