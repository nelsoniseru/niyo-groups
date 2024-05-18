import { Module, NestModule, MiddlewareConsumer } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from '@nestjs/mongoose';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { TaskSchema } from '../task/schemas/task.schema';
import { AuthenticationMiddleware } from '../middleware/middleware';
import { ConfigModule } from '@nestjs/config';
import { TaskGateway } from './task.gateway'
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.register({  
    secret:process.env.JWT_SECRET , 
    signOptions: { expiresIn:process.env.JWT_EXPIRE_IN},
  })
    ,MongooseModule.forFeature([{ name: 'Task', schema: TaskSchema}])],
  controllers: [TaskController],
  providers: [TaskService,TaskGateway],
  exports: [TaskService],

})
export class TaskModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
      consumer
          .apply(AuthenticationMiddleware)
          .forRoutes(TaskController)
  }
}