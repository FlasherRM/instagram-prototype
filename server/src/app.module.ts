import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { PostModule } from './post/post.module';
import {UsersModule} from "./users/users.module";

@Module({
  imports: [
      MongooseModule.forRoot('mongodb://localhost:27017/main'),
      PostModule,
      UsersModule
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
