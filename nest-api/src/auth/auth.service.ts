import {
  HttpException,
  Injectable,
  Logger,
  UnauthorizedException,
  BadRequestException,
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
import { MailService } from '../mail/mail.service';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
    private mailService: MailService,
  ) {}

  async register(
    createUserDto: RegisterUserDto,
  ): Promise<{ message: string; user: unknown; token: string }> {
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
    user.avatar = createUserDto.avatar;
    user.emailVerified = false;

    // Generate confirmation token (expires in 24h)
    const confirmationToken = crypto.randomBytes(32).toString('hex');
    user.emailConfirmationToken = await this.hashToken(confirmationToken);
    user.emailConfirmationExpiresAt = new Date(
      Date.now() + 24 * 60 * 60 * 1000,
    );

    const errors = await validate(user);
    if (errors.length > 0) {
      this.logger.warn(`Registration failed: validation errors`);
      throw new HttpException('Erreurs de validation', 400);
    }

    await this.usersRepository.save(user);

    // Send welcome confirmation email
    const frontendUrl =
      this.configService.get<string>('FRONTEND_URL') || 'http://localhost:5173';
    const confirmationUrl = `${frontendUrl}/confirm-email?token=${confirmationToken}&email=${encodeURIComponent(user.email)}`;

    try {
      await this.mailService.sendWelcomeConfirmationEmail(
        user.email,
        user.prenom,
        confirmationUrl,
      );
      this.logger.log(`Welcome email sent to: ${user.email}`);
    } catch (error) {
      this.logger.error(
        `Failed to send welcome email to ${user.email}: ${error}`,
      );
      // Don't fail registration if email fails
    }

    const token = await this.generateToken(user, false);

    const { password: _pass, emailConfirmationToken: _token, ...userWithoutSensitive } = user;

    this.logger.log(`User registered successfully: ${user.id} (${user.email})`);

    return {
      message: 'Utilisateur créé avec succès. Vérifiez votre email pour confirmer votre compte.',
      user: userWithoutSensitive,
      token,
    };
  }

  async confirmEmail(
    token: string,
    email: string,
  ): Promise<{ message: string; user: unknown }> {
    this.logger.log(`Email confirmation attempt for: ${email}`);

    const user = await this.usersRepository.findOne({
      where: { email },
    });

    if (!user) {
      this.logger.warn(`Email confirmation failed: user not found (${email})`);
      throw new BadRequestException('Lien de confirmation invalide');
    }

    if (user.emailVerified) {
      return {
        message: 'Adresse email déjà confirmée',
        user: this.sanitizeUser(user),
      };
    }

    if (!user.emailConfirmationToken || !user.emailConfirmationExpiresAt) {
      this.logger.warn(
        `Email confirmation failed: no token stored for ${email}`,
      );
      throw new BadRequestException('Lien de confirmation invalide');
    }

    if (new Date() > user.emailConfirmationExpiresAt) {
      this.logger.warn(`Email confirmation failed: token expired for ${email}`);
      throw new BadRequestException(
        'Le lien de confirmation a expiré. Veuillez demander un nouveau lien.',
      );
    }

    const hashedToken = await this.hashToken(token);
    if (hashedToken !== user.emailConfirmationToken) {
      this.logger.warn(
        `Email confirmation failed: token mismatch for ${email}`,
      );
      throw new BadRequestException('Lien de confirmation invalide');
    }

    // Mark email as verified and clear token
    user.emailVerified = true;
    user.emailConfirmationToken = undefined;
    user.emailConfirmationExpiresAt = undefined;

    await this.usersRepository.save(user);

    this.logger.log(`Email confirmed successfully for user: ${user.id}`);

    return {
      message: 'Adresse email confirmée avec succès',
      user: this.sanitizeUser(user),
    };
  }

  async resendConfirmationEmail(email: string): Promise<{ message: string }> {
    this.logger.log(`Resend confirmation email request for: ${email}`);

    const user = await this.usersRepository.findOne({
      where: { email },
    });

    if (!user) {
      // Don't reveal if email exists
      return {
        message:
          'Si cette adresse email est enregistrée, un email de confirmation a été envoyé.',
      };
    }

    if (user.emailVerified) {
      return {
        message: 'Cette adresse email est déjà confirmée.',
      };
    }

    // Generate new confirmation token
    const confirmationToken = crypto.randomBytes(32).toString('hex');
    user.emailConfirmationToken = await this.hashToken(confirmationToken);
    user.emailConfirmationExpiresAt = new Date(
      Date.now() + 24 * 60 * 60 * 1000,
    );

    await this.usersRepository.save(user);

    const frontendUrl =
      this.configService.get<string>('FRONTEND_URL') || 'http://localhost:5173';
    const confirmationUrl = `${frontendUrl}/confirm-email?token=${confirmationToken}&email=${encodeURIComponent(user.email)}`;

    try {
      await this.mailService.sendWelcomeConfirmationEmail(
        user.email,
        user.prenom,
        confirmationUrl,
      );
      this.logger.log(`Confirmation email resent to: ${user.email}`);
    } catch (error) {
      this.logger.error(
        `Failed to resend confirmation email to ${user.email}: ${error}`,
      );
    }

    return {
      message:
        'Si cette adresse email est enregistrée, un email de confirmation a été envoyé.',
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

    const { password: _pass, emailConfirmationToken: _token, ...userWithoutSensitive } = user;

    this.logger.log(
      `User logged in successfully: ${user.id} (${user.email}) - rememberMe: ${loginDto.rememberMe}`,
    );

    return {
      token,
      user: userWithoutSensitive,
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

  async getProfile(userId: number): Promise<{ message: string; user: unknown }> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('Utilisateur non trouvé');
    }

    return {
      message: 'Profil récupéré avec succès',
      user: this.sanitizeUser(user),
    };
  }

  async rememberMeVerify(
    userId: number,
  ): Promise<{ message: string; user: unknown; token: string }> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('Utilisateur non trouvé');
    }

    // IMPORTANT: Générer un nouveau token remember-me (30 jours) pour prolonger la session
    const token = await this.generateToken(user, true);

    return {
      message: 'Remember me vérifié avec succès',
      user: this.sanitizeUser(user),
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

  private async hashToken(token: string): Promise<string> {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  private sanitizeUser(user: User): Record<string, unknown> {
    const { password: _pass, emailConfirmationToken: _token, ...sanitized } = user;
    return sanitized;
  }
}
