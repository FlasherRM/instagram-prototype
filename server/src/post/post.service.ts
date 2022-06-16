import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import {Model} from "mongoose";
import {InjectModel} from "@nestjs/mongoose";
import {Post, PostDocument} from "./post.schema";
import {UsersService} from "../users/users.service";

@Injectable()
export class PostService {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>,
              private readonly usersService: UsersService) {
  }
  async create(createPostDto: CreatePostDto, author_id: number, filename: string) {
    const newArticle = new this.postModel(createPostDto);
    newArticle.photo = filename;
    let post = await this.usersService.newPost(newArticle._id, author_id)
    newArticle.author = await this.usersService.findById(author_id);
    await newArticle.save();

    return {
      "message": "Success"
    }
  }

  findAll() {
    return this.postModel.find().exec()
  }

  async likePost(user_id: string, post_id: number) {
    const post = await this.postModel.findById(post_id);

    if(post.likes.includes(user_id)) {
      await post.likes.splice(post.likes.indexOf(user_id), 1);
      post.save();
      return "SUCCESSFULLY DISLIKED"
    }

    post.likes.push(user_id);
    post.save();

    return {
      message: "success"
    }
  }
  async checkLiked(user_id: string, post_id: string) {
    const post = await this.postModel.findById(post_id);

    return !!post.likes.includes(user_id);
  }
  findOne(id: number) {
    return this.postModel.findById(id)
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
