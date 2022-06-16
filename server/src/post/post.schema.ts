import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {Document, Types} from 'mongoose';
import * as mongoose from "mongoose";
import {Type} from "class-transformer";
import {User} from "../users/users.schema";

export type PostDocument = Post & Document;

@Schema()
export class Post {
    @Prop({ required: true })
    title: string

    @Prop({default: []})
    likes: string[];

    @Prop({default: Date.now})
    date_added: Date

    @Prop()
    photo: string;

    @Prop({ ref: User.name })
    @Type(() => User)
    author: User;
}

export const PostSchema = SchemaFactory.createForClass(Post);