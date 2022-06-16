import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpException, HttpStatus,
  Param,
  Post,
  Req,
  Res,
  UnauthorizedException, UploadedFile, UseInterceptors
} from '@nestjs/common';
import {Request, Response} from 'express'
import {UsersService} from './users.service';
import {CreateUserDto} from './dto/create-user.dto';
import {JwtService} from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import {FileInterceptor} from "@nestjs/platform-express";
import {diskStorage} from "multer";
import {extname} from "path";

@Controller('auth')
export class UsersController {
  constructor(private readonly usersService: UsersService,
              private jwtService: JwtService,) {}
  @Get('user/:id')
  getUserById(@Param('id') id: number) {
    return this.usersService.findById(id);
  }
  @Post('register')
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
  async register(
      @Body() userDto: CreateUserDto,
      @Res({ passthrough: true }) response: Response,
      @UploadedFile() file: any
  )
  {
    const candidate = await this.usersService.findByEmail(userDto.email);
    if(candidate) {
      return new HttpException(`User with email ${userDto.email} already exist`, 400)
    }
    console.log(file)
    const newuser = this.usersService.LoginUser(userDto, file.filename)
    return {
      message: "USER SUCCESSFULLY REGISTERED"
    }
  }
  @Get('profile')
  async myprofile(
      @Req() req: Request,

  ) {
    const cookie = await req.cookies['jwt'];
    const data = await this.jwtService.verifyAsync(cookie);
    if(!data) {
      throw new UnauthorizedException();
    }
    const some = this.usersService.findById(data.id);
    return some;
  }
  @Post('login')
  async login(
      @Body('email') email: string,
      @Body('password') password: string,
      @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new BadRequestException('invalid credentials');
    }
    if (!(await bcrypt.compare(password, user.password))) {
      throw new BadRequestException('invalid Password or Email');
    }
    const jwt = await this.jwtService.signAsync({
      id: user.id,
    });
    response.cookie('jwt', jwt, { httpOnly: true });

    return {
      message: 'success',
    };
  }
  @Get('subscribe/:fol_id')
  async subscribe(@Req() req: Request, @Param('fol_id') fol_id: string) {
    const cookie = await req.cookies['jwt'];
    const data = await this.jwtService.verifyAsync(cookie);
    if(!data) {
      throw new UnauthorizedException();
    }
    const sub_id = data.id

    const result = await this.usersService.HandleSubscribe(sub_id, fol_id);
    if(result.success == false) {
      return result
    }
    return {
      message: `${result.sub} SUCCESSFULLY SUBSCRIBED TO ${result.fol}`
    }
  }
  @Get('unsubscribe/:fol_id')
  async unSubscribe(@Req() req: Request, @Param('fol_id') fol_id: string) {
    const cookie = await req.cookies['jwt'];
    const data = await this.jwtService.verifyAsync(cookie);
    if(!data) {
      throw new UnauthorizedException();
    }
    const sub_id = data.id

    const result = await this.usersService.HandleUnsubscribe(sub_id, fol_id);
    if(result.success == false) {
      return result;
    }
    return {
      message: `${result.sub} SUCCESSFULLY UNSUBSCRIBED TO ${result.fol}`
    }
  }
  @Post('logout')
  async logout(@Res({passthrough: true}) response: Response) {
    response.clearCookie('jwt');
    return {
      message: 'Successfully logout'
    }
  }
  @Get('checksub/:id')
  async isSubscribed(@Param('id') id: string, @Req() req: Request) {
    const cookie = await req.cookies['jwt'];
    const data = await this.jwtService.verifyAsync(cookie);
    if(!data) {
      throw new UnauthorizedException();
    }
    const sub_id = data.id

    return await this.usersService.checkIsSubscribed(sub_id, id)
  }
}
