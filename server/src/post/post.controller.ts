import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UnauthorizedException,
  Req,
  UseInterceptors, HttpException, HttpStatus, UploadedFile
} from '@nestjs/common';
import {Request} from 'express';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import {JwtService} from "@nestjs/jwt";
import {FileInterceptor} from "@nestjs/platform-express";
import {diskStorage} from "multer";
import {extname} from "path";

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService,
              private jwtService: JwtService) {}

  @Post('new')
  @UseInterceptors(FileInterceptor('photo', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const name = file.originalname.split('.')[0];
        const fileExtenstion = file.originalname.split('.')[1];
        const newFileName = name.split(" ").join('_')+'_'+Date.now()+'.'+fileExtenstion;

        cb(null, newFileName);
      }
    }),
    fileFilter: (req, file, cb) => {
      let ext = extname(file.originalname)
      if(ext !== '.jpg' && ext !== '.jpeg') {
        return cb(new HttpException('Only .jpg/.jpeg images are allowed!',HttpStatus.BAD_REQUEST), null);
      }
      cb(null, true)
    },
  }))
  async post(@Body() createPostDto: CreatePostDto, @Req() request: Request, @UploadedFile() file: any) {
    const cookie = request.cookies['jwt']
    const data = await this.jwtService.verifyAsync(cookie);
    if(!data) {
      throw new UnauthorizedException();
    }
    if (file.size > 5000000) {
      return "The file size is too big"
    }
    const author_id = data.id;
    return this.postService.create(createPostDto, author_id, file.filename);
  }

  @Get('like/:id')
  async likePost(@Param('id') post_id: number, @Req() request: Request) {
    const cookie = request.cookies['jwt']
    const data = await this.jwtService.verifyAsync(cookie);
    if(!data) {
      throw new UnauthorizedException();
    }
    const user_id = await data.id;
    return await this.postService.likePost(user_id, post_id)
  }
  @Get('liked/:id')
  async checkLiked(@Param('id') post_id: string, @Req() request: Request) {
    const cookie = request.cookies['jwt']
    const data = await this.jwtService.verifyAsync(cookie);
    if(!data) {
      throw new UnauthorizedException();
    }
    const user_id = await data.id;
    return await this.postService.checkLiked(user_id, post_id);
  }

  @Get()
  findAll() {
    return this.postService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(+id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postService.remove(+id);
  }
}
