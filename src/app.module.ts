import { TerminusModule } from '@nestjs/terminus';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import config from './config';
import { environments } from './environments';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ConversationModule } from './modules/conversation/conversation.module';
import { DatabaseModule } from './modules/database/database.module';
import { HealthController } from './health.controller';
import { MessageModule } from './modules/message/message.module';
import { InformationModule } from './modules/information/information.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: environments[process.env.NODE_ENV],
      load: [config],
      isGlobal: true,
      // validationSchema: Joi.object({
      //   JWT_SECRET: Joi.string().required(),
      //   JWT_REFRESH_SECRET: Joi.string().required(),
      //   ACCESS_TOKEN_EXPIRATION: Joi.string().required(),
      //   REFRESH_TOKEN_EXPIRATION: Joi.string().required(),
      // }),
      validationOptions: {
        abortEarly: true,
      },
    }),
    TerminusModule,
    AuthModule,
    UserModule,
    ConversationModule,
    MessageModule,
    DatabaseModule,
    InformationModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
