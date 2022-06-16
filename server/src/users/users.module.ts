import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {User, UserSchema} from "./users.schema";
import {JwtModule} from "@nestjs/jwt";

@Module({
  imports: [MongooseModule.forFeature([{
    name: User.name, schema: UserSchema
  }]),
    JwtModule.register({
      secret: 'secret',
      signOptions: { expiresIn: '24h' },
    }),
  ],

  controllers: [UsersController],
  providers: [UsersService]
})
export class UsersModule {}
