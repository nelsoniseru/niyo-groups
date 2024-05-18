import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { TaskService } from './task.service';
import { Task } from './schemas/task.schema';

@WebSocketGateway()
export class TaskGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly taskService: TaskService) {}

  @SubscribeMessage('findAllTasks')
  async findAll(@MessageBody() data: any): Promise<void> {
    const tasks = await this.taskService.findAll(data.user);
    this.server.emit('tasks', tasks);
  }

  async handleTaskChange(event: string, task: Task) {
    this.server.emit(event, task);
  }

  @SubscribeMessage('createTask')
  async create(@MessageBody() task: Task): Promise<void> {
    const createdTask = await this.taskService.create(task);
    this.handleTaskChange('taskCreated', createdTask);
  }

  @SubscribeMessage('updateTask')
  async update(@MessageBody() data: { id: string; task: Task }): Promise<void> {
    const updatedTask = await this.taskService.update(data.id, data.task);
    this.handleTaskChange('taskUpdated', updatedTask);
  }

  @SubscribeMessage('deleteTask')
  async remove(@MessageBody() id: string): Promise<void> {
    await this.taskService.remove(id);
    this.server.emit('taskDeleted', id);
  }
}
