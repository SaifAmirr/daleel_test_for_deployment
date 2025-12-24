import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from './modules/users/users.module';
import { BusinessesModule } from './modules/businesses/businesses.module';
import { InvoicesModule } from './modules/invoices/invoices.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,       // Must be defined
      autoLoadEntities: true,              // Loads all entities automatically
      synchronize: process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'development',  // Auto-sync in dev, disabled in prod
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,  // SSL only in production
    }),
    UsersModule,
    BusinessesModule,
    InvoicesModule,
  ],
})
export class AppModule {}
