import {
	Body,
	Controller,
	Get,
	HttpCode,
	Post,
	Query,
	Res,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Response } from 'express'
import { AuthService } from './auth.service'
import { AuthDto } from './dto/auth.dto'
import { RefreshTokenDto } from './dto/refresh-token.dto'
import { ResetPasswordDto } from './dto/reset-password.dto'
import { verifyEmailDto } from './dto/verify-email.dto'

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('login')
	async login(@Body() dto: AuthDto) {
		return this.authService.login(dto)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('login/access-token')
	async getNewTokens(@Body() dto: RefreshTokenDto) {
		return this.authService.getNewTokens(dto)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('register')
	async register(@Body() dto: AuthDto) {
		return this.authService.register(dto)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('verify-email/send')
	async sendConfirmEmail(@Body() { email }: { email: string }) {
		return await this.authService.sendVerificationEmail(email)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Get('verify-email/verify')
	async verifyEmail(@Query() dto: verifyEmailDto) {
		return await this.authService.verifyEmail(dto)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('reset-password')
	async resetPassword(@Body() dto: ResetPasswordDto) {
		return await this.authService.resetPassword(dto)
	}
}
