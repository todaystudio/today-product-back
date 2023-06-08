import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { getJwtConfig } from '../config/jwt.config'
import { PrismaService } from '../prisma.service'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtStrategy } from './jwt.strategy'
import { MailService } from 'src/mail/mail.service'

@Module({
	imports: [
		ConfigModule,
		PassportModule, // Добавить PassportModule
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getJwtConfig,
		}),
	],
	providers: [AuthService, JwtStrategy, PrismaService, MailService],
	controllers: [AuthController],
	exports: [AuthService],
})
export class AuthModule {}
