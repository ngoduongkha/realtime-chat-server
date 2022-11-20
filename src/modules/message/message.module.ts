import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigType } from '@nestjs/config';
import config from 'src/config';
import { MessageService } from './message.service';
import MessageGateway from './message.gateway';
import { InformationModule } from '../information/information.module';
import { Message } from '../database/entities';
import { ConversationModule } from '../conversation/conversation.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message]),
    JwtModule.registerAsync({
      inject: [config.KEY],
      useFactory: (configService: ConfigType<typeof config>) => {
        return {
          secret: configService.jwt.jwtSecret,
          signOptions: {
            expiresIn: parseInt(configService.jwt.accessTokenExpiration, 10),
          },
        };
      },
    }),
    InformationModule,
    ConversationModule,
  ],
  providers: [MessageGateway, MessageService],
})
export class MessageModule {}
