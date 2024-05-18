// src/auth/auth.service.ts
import { Injectable,HttpException, HttpStatus,BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {TaskService } from '../task/task.service';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../auth/schemas/user.schema';

import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<UserDocument>
  ) {}
  async login(user: LoginDto) {
    const loginDto = plainToInstance(LoginDto, user);
    const errors = await validate(loginDto);
    if (errors.length > 0) {
      const firstError = errors[0];
      const firstErrorMessage = Object.values(firstError.constraints)[0];
      throw new BadRequestException(`${firstErrorMessage}`);
    }
    const findUser = await this.userModel.findOne({ email: user.email });

    if (findUser && bcrypt.compareSync(user.password, findUser.password)) {
      const payload = { id: findUser._id, sub: findUser.email };
      return {
        statusCode: 200,
        access_token: this.jwtService.sign(payload),
      };
    } else {
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
    }
  }

  async register(user: RegisterDto) {
    const registerDto = plainToInstance(RegisterDto, user);
    const errors = await validate(registerDto);
    if (errors.length > 0) {
      const firstError = errors[0];
      const firstErrorMessage = Object.values(firstError.constraints)[0];
      throw new BadRequestException(`${firstErrorMessage}`);
    }
    const findUser = await this.userModel.findOne({ email: user.email });
    if(findUser) throw new HttpException('user already exist', HttpStatus.BAD_REQUEST);
    const hashedPassword = bcrypt.hashSync(user.password, 10);
    const newUser = await this.userModel.create({
      ...user,
      password: hashedPassword,
    });
    return {
      statusCode: 201,
      newUser
      };
  }

}
