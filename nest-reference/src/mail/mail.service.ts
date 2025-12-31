import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer, { Transporter } from 'nodemailer';
import fs from 'node:fs/promises';
import path from 'node:path';
import { PartnerRegistration } from 'src/partner-registration/entities/partner-registration.entity';

interface SendMailOptions {
  to: string | string[];
  subject: string;
  template?: string; // views/mail/<template>.hbs
  html?: string; // direct html
  context?: Record<string, any>;
  fromOverride?: string;
}

@Injectable()
export class MailService {
  private transporter: Transporter;
  private defaultFrom: string;

  constructor(private readonly config: ConfigService) {
    const nodeEnv = this.config.get<string>('NODE_ENV') || 'development';

    // Default "from" built from SMTP_* variables
    const fromName = this.config.get<string>('SMTP_FROM_NAME') || 'Rencontraire';
    const fromEmail = this.config.get<string>('SMTP_FROM') || 'no-reply@rencontraire.app';
    this.defaultFrom = `${fromName} <${fromEmail}>`;

    // Unified SMTP_* configuration with sensible defaults per environment
    const smtpHost =
      this.config.get<string>('SMTP_HOST') || (nodeEnv === 'development' || nodeEnv === 'test' ? 'mailpit' : 'smtp.com');
    const smtpPort = Number(
      this.config.get<string>('SMTP_PORT') || (nodeEnv === 'development' || nodeEnv === 'test' ? 1025 : 587),
    );
    const smtpAuthRaw = this.config.get<string>('SMTP_AUTH');
    const smtpAuth = typeof smtpAuthRaw === 'string' ? smtpAuthRaw.toLowerCase() === 'true' : false;
    const smtpUser = this.config.get<string>('SMTP_USER') || undefined;
    const smtpPass = this.config.get<string>('SMTP_PASS') || undefined;
    const smtpSecureMode = (this.config.get<string>('SMTP_SECURE') || '').toLowerCase(); // 'ssl' | 'tls' | 'none'

    console.log(smtpAuth, smtpAuthRaw, smtpUser, smtpPass, smtpSecureMode)

    // Determine transport security
    const useSsl = smtpSecureMode === 'ssl' || smtpPort === 465; // SMTPS
    const requireTls = smtpSecureMode === 'tls'; // STARTTLS

    const transportOptions: any = {
      host: smtpHost,
      port: smtpPort,
      secure: useSsl,
      // STARTTLS when not using implicit SSL
      ...(requireTls && !useSsl ? { requireTLS: true } : {}),
    };

    if (smtpAuth && smtpUser && smtpPass) {
      transportOptions.auth = { user: smtpUser, pass: smtpPass };
    }

    this.transporter = nodemailer.createTransport(transportOptions);
  }

  async send(options: SendMailOptions) {
    const htmlContent = options.html ?? (options.template ? await this.render(options.template, options.context) : undefined);

    return this.transporter.sendMail({
      to: options.to,
      subject: options.subject,
      from: options.fromOverride ?? this.defaultFrom,
      html: htmlContent,
    });
  }

  private async render(template: string, context: Record<string, any> = {}): Promise<string> {
    const filePath = path.join(process.cwd(), 'views', 'mail', `${template}.hbs`);
    const raw = await fs.readFile(filePath, 'utf-8');

    // Tiny mustache-like renderer supporting {{var}}
    return raw.replace(/{{\s*(\w+)\s*}}/g, (_, key: string) => {
      const value = context[key];
      return value !== undefined && value !== null ? String(value) : '';
    });
  }

  async sendPartnerRegistrationApproval(partnerRegistration: PartnerRegistration, generatedPassword?: string): Promise<void> {
    await this.send({
      to: partnerRegistration.email,
      subject: 'Rencontraire – Votre demande a été approuvée',
      template: 'partner-registration-approved',
      context: {
        firstName: partnerRegistration.first_name,
        establishmentName: partnerRegistration.establishment?.displayName ?? 'votre établissement',
        email: partnerRegistration.email,
        password: generatedPassword ?? '',
      },
    }).catch(() => void 0);
  }

  async sendPartnerRegistrationRejection(partnerRegistration: PartnerRegistration): Promise<void> {
    const rejectionReasonText = partnerRegistration.rejection_reason
      ? `<p><strong>Raison :</strong> ${partnerRegistration.rejection_reason}</p>`
      : '';

    await this.send({
      to: partnerRegistration.email,
      subject: 'Rencontraire – Votre demande d\'inscription',
      template: 'partner-registration-rejected',
      context: {
        firstName: partnerRegistration.first_name,
        establishmentName: partnerRegistration.establishment?.displayName ?? 'votre établissement',
        rejectionReasonText,
      },
    }).catch(() => void 0);
  }
}
