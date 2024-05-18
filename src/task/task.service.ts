import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, TaskDocument } from './schemas/task.schema';

import { TaskDto } from './dto/task.dto';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
@Injectable()
export class TaskService {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) { }

  async findAll(user): Promise<Task[]> {
    return await this.taskModel.find({ userId: user });
  }

  async findOne(id: string): Promise<Task> {
    return await this.taskModel.findOne({ _id: id });
  }

  async create(task: Task): Promise<Task> {
    const taskDto = plainToInstance(TaskDto, task);
    const errors = await validate(taskDto);
    if (errors.length > 0) {
      const firstError = errors[0];
      const firstErrorMessage = Object.values(firstError.constraints)[0];
      throw new BadRequestException(`${firstErrorMessage}`);
    }
    const newTask = new this.taskModel(task);
    return await newTask.save();
  }

  async update(id: string, task: Task): Promise<Task> {
    const taskDto = plainToInstance(TaskDto, task);
    const errors = await validate(taskDto);
    if (errors.length > 0) {
      const firstError = errors[0];
      const firstErrorMessage = Object.values(firstError.constraints)[0];
      throw new BadRequestException(`${firstErrorMessage}`);
    }
    await this.taskModel.updateOne({ _id: id }, { $set: task });
    return this.taskModel.findOne({ _id: id });
  }

  async remove(id: string) {
    await this.taskModel.deleteOne({ _id: id });
    return { message: "deleted successfully", statusCode: 200 }
  }
}
