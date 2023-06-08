import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { AuthService } from 'src/auth/auth.service'
import { MailService } from 'src/mail/mail.service'
import { PaginationService } from 'src/pagination/pagination.service'
import { ParserService } from 'src/parser/parser.service'
import { PriceService } from 'src/price/price.service'
import { PrismaService } from 'src/prisma.service'
import { ProductService } from 'src/product/product.service'
import { SubscribeService } from 'src/subscribe/subscribe.service'
import { TelegramService } from 'src/telegram/telegram.service'
import { UserService } from 'src/user/user.service'
import { CronController } from './cron.controller'
import { CronService } from './cron.service'

@Module({
	controllers: [CronController],
	providers: [
		CronService,
		ProductService,
		PrismaService,
		PaginationService,
		ParserService,
		PriceService,
		TelegramService,
		SubscribeService,
		ConfigService,
		UserService,
		MailService,
		AuthService,
		JwtService,
	],
	exports: [CronService],
})
export class CronModule {}
