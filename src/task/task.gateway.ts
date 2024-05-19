import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { TaskService } from './task.service';
import { Task } from './schemas/task.schema';
import { OnModuleInit } from '@nestjs/common';

@WebSocketGateway()
export class TaskGateway  {
  @WebSocketServer()
  server: Server;

  constructor(private readonly taskService: TaskService) {}
onModuleInit() {
  this.server.on("connection",(socket)=>{
   console.log(socket.id)
   console.log("connceted")
  })
}
  @SubscribeMessage('findAllTasks')
  async findAll(@MessageBody() data: any): Promise<void> {
    const tasks = await this.taskService.findAll(data.userId);
    this.server.emit('tasks',tasks);
  }

  @SubscribeMessage('createTask')
  async create(@MessageBody() task: Task): Promise<void> {

    const createdTask = await this.taskService.create(task);
    console.log(createdTask)
    this.server.emit('taskCreated', createdTask);
  }

  @SubscribeMessage('updateTask')
  async update(@MessageBody() data: { task_id: string; task: Task }): Promise<void> {
    const updatedTask = await this.taskService.update(data.task_id, data.task);
    this.server.emit('taskUpdated', updatedTask);
  }

  @SubscribeMessage('findOneTask')
  async findOne(@MessageBody() data:any): Promise<void> {
    const result = await this.taskService.findOne(data.id);
    console.log(data)
    console.log(result)
    this.server.emit('OneTask',result);
  }

  @SubscribeMessage('deleteTask')
  async remove(@MessageBody() data:any): Promise<void> {
  let result =  await this.taskService.remove(data.id);
    this.server.emit('taskDeleted', result);
  }
}
