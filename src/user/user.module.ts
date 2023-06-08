import { Module } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { AuthService } from 'src/auth/auth.service'
import { MailService } from 'src/mail/mail.service'
import { PrismaService } from 'src/prisma.service'
import { UserController } from './user.controller'
import { UserService } from './user.service'

@Module({
	controllers: [UserController],
	providers: [UserService, PrismaService, MailService, AuthService, JwtService],
	exports: [UserService],
})
export class UserModule {}
