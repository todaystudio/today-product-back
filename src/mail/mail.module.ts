import { Module } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { AuthService } from 'src/auth/auth.service'
import { PrismaService } from 'src/prisma.service'
import { UserService } from 'src/user/user.service'
import { MailController } from './mail.controller'
import { MailService } from './mail.service'

@Module({
	controllers: [MailController],
	providers: [MailService, UserService, PrismaService, AuthService, JwtService],
	exports: [MailService],
})
export class MailModule {}
