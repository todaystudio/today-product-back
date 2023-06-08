import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { TelegrafModule } from 'nestjs-telegraf'
import { AuthService } from 'src/auth/auth.service'
import { MyConfigModule } from 'src/config/config.module'
import { MailService } from 'src/mail/mail.service'
import { PaginationService } from 'src/pagination/pagination.service'
import { PrismaService } from 'src/prisma.service'
import { ProductService } from 'src/product/product.service'
import { SubscribeService } from 'src/subscribe/subscribe.service'
import { UserService } from 'src/user/user.service'
import * as LocalSession from 'telegraf-session-local'
import { TelegramController } from './telegram.controller'
import { TelegramService } from './telegram.service'
import { TelegramUpdate } from './telegram.update'

export const sessions = new LocalSession({
	database: '../session_db.json',
})

@Module({
	imports: [
		MyConfigModule,
		ConfigModule,
		TelegrafModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => ({
				middlewares: [sessions.middleware()],
				token: configService.get<string>('TG_TOKEN'),
			}),
			inject: [ConfigService],
		}),
	],
	controllers: [TelegramController],
	providers: [
		TelegramService,
		ConfigService,
		TelegramUpdate,
		SubscribeService,
		ProductService,
		PaginationService,
		PrismaService,
		UserService,
		ConfigService,
		MailService,
		AuthService,
		JwtService,
		SubscribeService,
	],
	exports: [TelegramService],
})
export class TelegramModule {}
