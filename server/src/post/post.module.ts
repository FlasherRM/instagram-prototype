import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {Post, PostSchema} from "./post.schema";
import {JwtModule} from "@nestjs/jwt";
import {UsersService} from "../users/users.service";
import {User, UserSchema} from "../users/users.schema";

@Module({
  imports: [
      MongooseModule.forFeature([
          {name: Post.name, schema: PostSchema},
          {name: User.name, schema: UserSchema}
  ]),
      JwtModule.register({
          secret: 'secret',
          signOptions: { expiresIn: '24h' },
      })],
  controllers: [PostController],
  providers: [PostService, UsersService]
})
export class PostModule {}
