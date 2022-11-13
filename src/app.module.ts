import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from './config';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ load: config, isGlobal: true }),
    TypeOrmModule.forRootAsync({}),
    AuthModule,
    UserModule,
  ],
})
export class AppModule {}
