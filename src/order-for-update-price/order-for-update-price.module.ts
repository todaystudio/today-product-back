import { Module } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { AuthService } from 'src/auth/auth.service'
import { MailService } from 'src/mail/mail.service'
import { PrismaService } from 'src/prisma.service'
import { UserService } from 'src/user/user.service'
import { OrderForUpdatePriceController } from './order-for-update-price.controller'
import { OrderForUpdatePriceService } from './order-for-update-price.service'

@Module({
	controllers: [OrderForUpdatePriceController],
	providers: [
		OrderForUpdatePriceService,
		PrismaService,
		UserService,
		MailService,
		AuthService,
		JwtService,
	],
})
export class OrderForUpdatePriceModule {}
