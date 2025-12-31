import {
  HttpException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dto/registerDto';
import { validate } from 'class-validator';
import {
  UserAlreadyExistsException,
  UserDoesntExistsException,
} from './auth.exceptions';
import { LoginDto, LoginResponseDto } from './dto/loginDto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { jwtConstants } from './constants';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(
    createUserDto: RegisterUserDto,
  ): Promise<{ message: string; user: any; token: string }> {
    this.logger.log(`Registration attempt for email: ${createUserDto.email}`);

    const existingUser = await this.usersRepository.findOne({
      where: [{ email: createUserDto.email }, { pseudo: createUserDto.pseudo }],
    });

    if (existingUser) {
      this.logger.warn(
        `Registration failed: user already exists (${createUserDto.email})`,
      );
      throw new UserAlreadyExistsException();
    }

    const user = new User();
    user.nom = createUserDto.nom;
    user.prenom = createUserDto.prenom;
    user.pseudo = createUserDto.pseudo;
    user.email = createUserDto.email;
    user.password = createUserDto.password;
    user.icone = createUserDto.icone;

    const errors = await validate(user);
    if (errors.length > 0) {
      this.logger.warn(`Registration failed: validation errors`);
      throw new HttpException('Erreurs de validation', 400);
    }

    await this.usersRepository.save(user);

    const token = await this.generateToken(user, false);

    const { password: _pass, ...userWithoutPassword } = user;

    this.logger.log(`User registered successfully: ${user.id} (${user.email})`);

    return {
      message: 'Utilisateur créé avec succès',
      user: userWithoutPassword,
      token,
    };
  }

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    this.logger.log(`Login attempt for email: ${loginDto.email}`);

    const user = await this.usersRepository.findOne({
      where: [{ email: loginDto.email }],
    });

    if (!user) {
      this.logger.warn(`Login failed: user not found (${loginDto.email})`);
      throw new UserDoesntExistsException();
    }

    const isValidPassword = await user.comparePassword(loginDto.password);

    if (!isValidPassword) {
      this.logger.warn(
        `Login failed: invalid password for user ${user.id} (${loginDto.email})`,
      );
      throw new UnauthorizedException('Identifiants invalides');
    }

    const token = await this.generateToken(user, loginDto.rememberMe || false);

    const { password: _pass, ...userWithoutPassword } = user;

    this.logger.log(
      `User logged in successfully: ${user.id} (${user.email}) - rememberMe: ${loginDto.rememberMe}`,
    );

    return {
      token,
      user: userWithoutPassword,
      rememberMe: loginDto.rememberMe,
    };
  }

  verifyToken(user: { userId: number; email: string }): {
    message: string;
    user: { userId: number; email: string };
  } {
    return {
      message: 'Token valide',
      user,
    };
  }

  async getProfile(userId: number): Promise<{ message: string; user: any }> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('Utilisateur non trouvé');
    }

    const { password: _pass, ...userWithoutPassword } = user;

    return {
      message: 'Profil récupéré avec succès',
      user: userWithoutPassword,
    };
  }

  async rememberMeVerify(
    userId: number,
  ): Promise<{ message: string; user: any; token: string }> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('Utilisateur non trouvé');
    }

    const token = await this.generateToken(user, false);
    const { password: _pass, ...userWithoutPassword } = user;

    return {
      message: 'Remember me vérifié avec succès',
      user: userWithoutPassword,
      token,
    };
  }

  private async generateToken(
    user: User,
    rememberMe: boolean,
  ): Promise<string> {
    const payload = {
      sub: user.id,
      userId: user.id,
      email: user.email,
      rememberMe,
    };

    const expiresIn = rememberMe
      ? this.configService.get<string>('JWT_REMEMBER_EXPIRES_IN') ||
        jwtConstants.rememberExpiresIn
      : this.configService.get<string>('JWT_EXPIRES_IN') ||
        jwtConstants.expiresIn;

    return this.jwtService.signAsync(payload, { expiresIn });
  }

  async findUserById(id: number): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }
}
