// auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TaskModule } from '../task/task.module';
import { UserSchema } from '../auth/schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    
 MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    TaskModule, 
    PassportModule,
    JwtModule.register({  secret:process.env.JWT_SECRET, 
      signOptions: { expiresIn:  process.env.JWT_EXPIRE_IN },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService], 
})
export class AuthModule {}
