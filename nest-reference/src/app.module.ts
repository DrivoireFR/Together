import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { User } from './users/entities/user.entity';
import { EstablishmentsModule } from './establishments/establishments.module';
import { Establishment } from './establishments/entities/establishment.entity';
import { ConfigModule } from '@nestjs/config';
import { PartnerRegistrationModule } from './partner-registration/partner-registration.module';
import { MailModule } from './mail/mail.module';
import { StripeModule } from './stripe/stripe.module';
import { PartnerRegistration } from './partner-registration/entities/partner-registration.entity';
import { AdminOwnerModule } from './admin-owner/admin-owner.module';
import { OwnerOverviewModule } from './owner-overview/owner-overview.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: process.env.DATABASE_PATH || './database.sqlite',
      entities: [
        User,
        Establishment,
        PartnerRegistration
      ],
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    EstablishmentsModule,
    PartnerRegistrationModule,
    MailModule,
    AdminOwnerModule,
    OwnerOverviewModule,
    StripeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) { }
}
