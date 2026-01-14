import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import * as Handlebars from 'handlebars';

interface SendMailOptions {
  to: string | string[];
  subject: string;
  template?: string; // views/mail/<template>.hbs
  html?: string; // direct html
  context?: Record<string, unknown>;
  fromOverride?: string;
}

@Injectable()
export class MailService {
  private transporter: Transporter;
  private defaultFrom: string;
  private templateCache: Map<string, HandlebarsTemplateDelegate> = new Map();

  constructor(private readonly config: ConfigService) {
    const nodeEnv = this.config.get<string>('NODE_ENV') || 'development';

    // Default "from" built from SMTP_* variables
    const fromName = this.config.get<string>('SMTP_FROM_NAME') || 'Together';
    const fromEmail =
      this.config.get<string>('SMTP_FROM') || 'no-reply@together.app';
    this.defaultFrom = `${fromName} <${fromEmail}>`;

    // Unified SMTP_* configuration with sensible defaults per environment
    const smtpHost =
      this.config.get<string>('SMTP_HOST') ||
      (nodeEnv === 'development' || nodeEnv === 'test' ? 'mailpit' : 'smtp.com');
    const smtpPort = Number(
      this.config.get<string>('SMTP_PORT') ||
      (nodeEnv === 'development' || nodeEnv === 'test' ? 1025 : 587),
    );
    const smtpAuthRaw = this.config.get<string>('SMTP_AUTH');
    const smtpAuth =
      typeof smtpAuthRaw === 'string'
        ? smtpAuthRaw.toLowerCase() === 'true'
        : false;
    const smtpUser = this.config.get<string>('SMTP_USER') || undefined;
    const smtpPass = this.config.get<string>('SMTP_PASS') || undefined;
    const smtpSecureMode = (
      this.config.get<string>('SMTP_SECURE') || ''
    ).toLowerCase(); // 'ssl' | 'tls' | 'none'

    // Determine transport security
    const useSsl = smtpSecureMode === 'ssl' || smtpPort === 465; // SMTPS
    const requireTls = smtpSecureMode === 'tls'; // STARTTLS

    const transportOptions: nodemailer.TransportOptions & {
      host: string;
      port: number;
      secure: boolean;
      requireTLS?: boolean;
      auth?: { user: string; pass: string };
    } = {
      host: smtpHost,
      port: smtpPort,
      secure: useSsl,
      ...(requireTls && !useSsl ? { requireTLS: true } : {}),
    };

    if (smtpAuth && smtpUser && smtpPass) {
      transportOptions.auth = { user: smtpUser, pass: smtpPass };
    }

    this.transporter = nodemailer.createTransport(transportOptions);
  }

  async send(options: SendMailOptions): Promise<void> {
    const htmlContent =
      options.html ??
      (options.template
        ? await this.render(options.template, options.context)
        : undefined);

    await this.transporter.sendMail({
      to: options.to,
      subject: options.subject,
      from: options.fromOverride ?? this.defaultFrom,
      html: htmlContent,
    });
  }

  private async render(
    template: string,
    context: Record<string, unknown> = {},
  ): Promise<string> {
    // Check cache first
    let compiledTemplate = this.templateCache.get(template);

    if (!compiledTemplate) {
      const filePath = path.join(
        process.cwd(),
        'views',
        'mail',
        `${template}.hbs`,
      );
      const raw = await fs.readFile(filePath, 'utf-8');
      compiledTemplate = Handlebars.compile(raw);
      this.templateCache.set(template, compiledTemplate);
    }

    return compiledTemplate(context);
  }

  /**
   * Send welcome email with confirmation link after user registration
   */
  async sendWelcomeConfirmationEmail(
    to: string,
    firstName: string,
    confirmationUrl: string,
  ): Promise<void> {
    await this.send({
      to,
      subject: 'Together – Bienvenue ! Confirmez votre adresse email',
      template: 'welcome-confirmation',
      context: {
        firstName,
        confirmationUrl,
        currentYear: new Date().getFullYear(),
      },
    });
  }

  /**
   * Send password reset email with reset link
   */
  async sendPasswordResetEmail(
    to: string,
    firstName: string,
    resetUrl: string,
  ): Promise<void> {
    await this.send({
      to,
      subject: 'Together – Réinitialisation de votre mot de passe',
      template: 'password-reset',
      context: {
        firstName,
        resetUrl,
        currentYear: new Date().getFullYear(),
      },
    });
  }
}
