import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskSchema } from './tasks/schema/task.schema';
import { TaskService } from './tasks/task.service';
import { TaskController } from './tasks/task.controller';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { UsersSchema } from './users/schema/user.schema';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI, {
      dbName: 'todolist',
    }),
    MongooseModule.forFeature([{ name: 'Task', schema: TaskSchema }]),
    UsersModule,
  ],
  controllers: [AppController, TaskController],
  providers: [AppService, TaskService],
})
export class AppModule {}
