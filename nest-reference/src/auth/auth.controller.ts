import { Body, Controller, Get, HttpException, Post, UseGuards, Request } from '@nestjs/common';
import { RegisterUserDto } from './dto/registerDto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/loginDto';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    async create(@Body() createUserDto: RegisterUserDto) {
        try {
            const user = await this.authService.register(createUserDto);
            return user;
        } catch (err) {
            if (err instanceof HttpException) {
                return err
            } else {
                return new HttpException('Un problème est survenue, merci de contacter le développeur : ' + err, 500);
            }
        }
    }

    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        try {
            const user = await this.authService.login(loginDto);
            return user;
        } catch (err) {
            return new HttpException('Un problème est survenue, merci de contacter le développeur.', 500);
        }
    }

    @UseGuards(AuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }
}
