import {Controller, Get, Param, Res} from '@nestjs/common';

@Controller('')
export class AppController {
    @Get()
    async getAll() {
        return
    }
    @Get('uploads/:filename')
    async getImage(@Param("filename") filename: string, @Res() res: any) {
        res.sendFile(filename, { root: 'uploads/'});
    }
}
