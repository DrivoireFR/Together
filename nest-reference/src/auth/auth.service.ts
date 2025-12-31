import { HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserType } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dto/registerDto';
import { validate } from 'class-validator';
import { UserAlreadyExistsException, UserDoesntExistsException } from 'src/auth/auth.exceptions';
import { LoginDto, LoginResponseDto } from './dto/loginDto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private jwtService: JwtService
    ) { }

    async register(createUserDto: RegisterUserDto): Promise<User | HttpException> {
        // Interdire la création de comptes OWNER/ADMIN par l'endpoint public
        if (createUserDto.role !== UserType.USER) {
            throw new UnauthorizedException('Only USER accounts can be self-registered');
        }
        const existingUser = await this.usersRepository.findOne({
            where: [
                { email: createUserDto.email },
            ]
        });

        if (existingUser) {
            throw new UserAlreadyExistsException()
        }

        const user = new User();
        user.email = createUserDto.email;
        user.password = createUserDto.password;
        user.role = UserType.USER;

        const errors = await validate(user);
        if (errors.length > 0) {
            // console.log(errors)
            throw new Error('Bad request');
        };

        try {
            await this.usersRepository.save(user);
        }
        catch (err) {
            throw new Error(err)
        }

        return user;
    }

    async login(
        loginDto: LoginDto
    ): Promise<LoginResponseDto | HttpException> {
        const user = await this.usersRepository.findOne({
            where: [
                { email: loginDto.email },
            ]
        });

        if (!user) throw new UserDoesntExistsException()

        const isValidPassword = await user.comparePassword(loginDto.password);

        if (!isValidPassword) {
            throw new UnauthorizedException();
        }

        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName,
        };

        return {
            token: await this.jwtService.signAsync(payload),
        };
    }
}
