import { MailerModule } from '@nestjs-modules/mailer'
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter'
import { Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'
import { join } from 'path'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { CategoryModule } from './category/category.module'
import { MyConfigModule } from './config/config.module'
import { CronModule } from './cron/cron.module'
import { FileModule } from './file/file.module'
import { MailModule } from './mail/mail.module'
import { PaginationModule } from './pagination/pagination.module'
import { ParserModule } from './parser/parser.module'
import { PriceModule } from './price/price.module'
import { PrismaService } from './prisma.service'
import { ProductModule } from './product/product.module'
import { ShopModule } from './shop/shop.module'
import { SubscribeModule } from './subscribe/subscribe.module'
import { TelegramModule } from './telegram/telegram.module'
import { UserModule } from './user/user.module'
import { OrderForUpdatePriceModule } from './order-for-update-price/order-for-update-price.module';
import { StatisticsModule } from './statistics/statistics.module';

@Module({
	imports: [
		MyConfigModule,
		AuthModule,
		UserModule,
		ProductModule,
		PriceModule,
		ShopModule,
		CategoryModule,
		PaginationModule,
		FileModule,
		TelegramModule,
		SubscribeModule,
		ParserModule,
		CronModule,
		ScheduleModule.forRoot(),
		MailerModule.forRoot({
			transport: 'smtps://crm@school-sochi.ru:vXsBBb22@smtp.timeweb.ru',
			defaults: {
				from: '"Today Product" <crm@school-sochi.ru>',
			},
			template: {
				dir: join(process.cwd(), 'templates'),
				adapter: new PugAdapter(),
				options: {
					strict: true,
				},
			},
		}),
		MailModule,
		OrderForUpdatePriceModule,
		StatisticsModule,
	],
	controllers: [AppController],
	providers: [AppService, PrismaService],
})
export class AppModule {}
