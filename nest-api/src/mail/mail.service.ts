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
  template?: string;
  html?: string;
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

    const fromName = this.config.get<string>('SMTP_FROM_NAME') || 'Together';
    const fromEmail =
      this.config.get<string>('SMTP_FROM') || 'no-reply@together.app';
    this.defaultFrom = `${fromName} <${fromEmail}>`;

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
    ).toLowerCase();

    const useSsl = smtpSecureMode === 'ssl' || smtpPort === 465;
    const requireTls = smtpSecureMode === 'tls';

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

  async sendOtpEmail(
    to: string,
    firstName: string,
    otpCode: string,
  ): Promise<void> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Together</h2>
        <p>Bonjour ${firstName},</p>
        <p>Votre code de connexion est :</p>
        <div style="background: #f4f4f4; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #333;">
            ${otpCode}
          </span>
        </div>
        <p>Ce code est valable <strong>10 minutes</strong>.</p>
        <p>Si vous n'avez pas demandé ce code, ignorez cet email.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="color: #999; font-size: 12px;">
          Together &copy; ${new Date().getFullYear()}
        </p>
      </div>
    `;

    await this.send({
      to,
      subject: 'Together – Votre code de connexion',
      html,
    });
  }
}
