import {
  Injectable,
  Logger,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { jwtConstants } from './constants';
import { MailService } from '../mail/mail.service';
import {
  UserAlreadyExistsException,
  UserDoesntExistsException,
} from './auth.exceptions';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  private static readonly OTP_LENGTH = 6;
  private static readonly OTP_EXPIRY_MINUTES = 10;

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
    private mailService: MailService,
  ) {}

  async register(
    registerDto: RegisterDto,
  ): Promise<{ message: string; email: string }> {
    this.logger.log(`Registration attempt for email: ${registerDto.email}`);

    const existingUser = await this.usersRepository.findOne({
      where: [{ email: registerDto.email }, { pseudo: registerDto.pseudo }],
    });

    if (existingUser) {
      this.logger.warn(
        `Registration failed: user already exists (${registerDto.email})`,
      );
      throw new UserAlreadyExistsException();
    }

    const user = new User();
    user.nom = registerDto.nom;
    user.prenom = registerDto.prenom;
    user.pseudo = registerDto.pseudo;
    user.email = registerDto.email;
    user.avatar = registerDto.avatar;
    user.emailVerified = false;

    const otpCode = this.generateOtp();
    user.otpCode = this.hashOtp(otpCode);
    user.otpExpiresAt = new Date(
      Date.now() + AuthService.OTP_EXPIRY_MINUTES * 60 * 1000,
    );

    await this.usersRepository.save(user);

    await this.sendOtpEmail(user.email, user.prenom, otpCode);

    this.logger.log(`User registered successfully: ${user.id} (${user.email})`);

    return {
      message: 'Compte créé. Un code OTP a été envoyé à votre adresse email.',
      email: user.email,
    };
  }

  async requestOtp(email: string): Promise<{ message: string }> {
    this.logger.log(`OTP request for email: ${email}`);

    const user = await this.usersRepository.findOne({ where: { email } });

    if (!user) {
      this.logger.warn(`OTP request for non-existent email: ${email}`);
      return {
        message:
          'Si cette adresse email est enregistrée, un code OTP a été envoyé.',
      };
    }

    const otpCode = this.generateOtp();
    user.otpCode = this.hashOtp(otpCode);
    user.otpExpiresAt = new Date(
      Date.now() + AuthService.OTP_EXPIRY_MINUTES * 60 * 1000,
    );

    await this.usersRepository.save(user);

    await this.sendOtpEmail(user.email, user.prenom, otpCode);

    this.logger.log(`OTP sent to: ${user.email}`);

    return {
      message:
        'Si cette adresse email est enregistrée, un code OTP a été envoyé.',
    };
  }

  async verifyOtp(
    email: string,
    code: string,
  ): Promise<{
    message: string;
    token: string;
    user: Record<string, unknown>;
  }> {
    this.logger.log(`OTP verification attempt for: ${email}`);

    const user = await this.usersRepository.findOne({ where: { email } });

    if (!user) {
      this.logger.warn(`OTP verification failed: user not found (${email})`);
      throw new UserDoesntExistsException();
    }

    if (!user.otpCode || !user.otpExpiresAt) {
      this.logger.warn(`OTP verification failed: no OTP pending for ${email}`);
      throw new BadRequestException(
        'Aucun code OTP en attente. Veuillez en demander un nouveau.',
      );
    }

    if (new Date() > user.otpExpiresAt) {
      this.logger.warn(`OTP verification failed: expired for ${email}`);
      throw new BadRequestException(
        'Le code OTP a expiré. Veuillez en demander un nouveau.',
      );
    }

    const hashedCode = this.hashOtp(code);
    if (hashedCode !== user.otpCode) {
      this.logger.warn(`OTP verification failed: invalid code for ${email}`);
      throw new UnauthorizedException('Code OTP invalide.');
    }

    user.otpCode = undefined;
    user.otpExpiresAt = undefined;
    user.emailVerified = true;

    await this.usersRepository.save(user);

    const token = await this.generateToken(user);

    this.logger.log(`User authenticated via OTP: ${user.id} (${user.email})`);

    return {
      message: 'Connexion réussie',
      token,
      user: this.sanitizeUser(user),
    };
  }

  verifyToken(payload: { userId: number; email: string }): {
    message: string;
    user: { userId: number; email: string };
  } {
    return {
      message: 'Token valide',
      user: payload,
    };
  }

  async getProfile(
    userId: number,
  ): Promise<{ message: string; user: Record<string, unknown> }> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['group'],
    });

    if (!user) {
      throw new UnauthorizedException('Utilisateur non trouvé');
    }

    return {
      message: 'Profil récupéré avec succès',
      user: this.sanitizeUser(user),
    };
  }

  async refreshToken(userId: number): Promise<{
    message: string;
    user: Record<string, unknown>;
    token: string;
  }> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('Utilisateur non trouvé');
    }

    const token = await this.generateToken(user);

    return {
      message: 'Token renouvelé avec succès',
      user: this.sanitizeUser(user),
      token,
    };
  }

  private generateOtp(): string {
    const digits = crypto.randomInt(0, 10 ** AuthService.OTP_LENGTH);
    return digits.toString().padStart(AuthService.OTP_LENGTH, '0');
  }

  private hashOtp(otp: string): string {
    return crypto.createHash('sha256').update(otp).digest('hex');
  }

  private async generateToken(user: User): Promise<string> {
    const payload = {
      sub: user.id,
      userId: user.id,
      email: user.email,
    };

    const expiresIn =
      this.configService.get<string>('JWT_EXPIRES_IN') ||
      jwtConstants.expiresIn;

    return this.jwtService.signAsync(payload, { expiresIn });
  }

  async findUserById(id: number): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  private sanitizeUser(user: User): Record<string, unknown> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { otpCode, otpExpiresAt, ...sanitized } = user;
    return sanitized;
  }

  private async sendOtpEmail(
    email: string,
    firstName: string,
    otpCode: string,
  ): Promise<void> {
    try {
      await this.mailService.sendOtpEmail(email, firstName, otpCode);
      this.logger.log(`OTP email sent to: ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send OTP email to ${email}: ${error}`);
    }
  }
}
