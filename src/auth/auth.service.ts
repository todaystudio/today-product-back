import {
	BadRequestException,
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { User } from '@prisma/client'
import { hash, verify } from 'argon2'
import {
	IResetPasswordMailContext,
	IVerificationMailContext,
	MailTemplates,
} from 'src/mail/mail.interface'
import { MailService } from 'src/mail/mail.service'
import { PrismaService } from '../prisma.service'
import { generatePassword } from '../utils/generatePassword'
import { AuthDto } from './dto/auth.dto'
import { RefreshTokenDto } from './dto/refresh-token.dto'
import { ResetPasswordDto } from './dto/reset-password.dto'
import { verifyEmailDto } from './dto/verify-email.dto'

@Injectable()
export class AuthService {
	constructor(
		private prisma: PrismaService,
		private jwt: JwtService,
		private mailService: MailService
	) {}

	async login(dto: AuthDto) {
		const user = await this.validateUser(dto)

		const tokens = await this.issueTokens(user.id)

		return {
			user: this.returnUserFields(user),
			...tokens,
		}
	}

	async getNewTokens(dto: RefreshTokenDto) {
		const refreshToken = dto.refreshToken
		const result = await this.jwt.verifyAsync(refreshToken)

		if (!result) throw new UnauthorizedException('Invalid refresh token')

		const user = await this.prisma.user.findUnique({
			where: { id: result.id },
		})

		const tokens = await this.issueTokens(user.id)

		return {
			user: this.returnUserFields(user),
			...tokens,
		}
	}

	async register(dto: AuthDto) {
		const oldUser = await this.prisma.user.findUnique({
			where: {
				email: dto.email,
			},
		})

		if (oldUser)
			throw new BadRequestException('Такой пользователь уже зарегистрирован')

		const user = await this.prisma.user.create({
			data: {
				email: dto.email,
				name: dto.name,
				password: await hash(dto.password),
			},
		})

		if (user.emailConfirm)
			throw new BadRequestException('Email confirmed already')

		await this.sendVerificationEmail(user.email)

		const tokens = await this.issueTokens(user.id)

		return {
			user: this.returnUserFields(user),
			...tokens,
		}
	}

	private async issueTokens(userId: number) {
		const data = { id: userId }

		const accessToken = this.jwt.sign(data, {
			expiresIn: '1h',
		})

		const refreshToken = this.jwt.sign(data, {
			expiresIn: '7d',
		})

		return { accessToken, refreshToken }
	}

	private returnUserFields(user: User) {
		return {
			id: user.id,
			email: user.email,
		}
	}

	private async validateUser(dto: AuthDto) {
		const user = await this.prisma.user.findUnique({
			where: {
				email: dto.email,
			},
		})

		if (!user) throw new NotFoundException(`${dto.email} – не найден`)

		const isValid = await verify(user.password, dto.password)

		if (!isValid) throw new UnauthorizedException('Неверные логин или пароль')

		return user
	}

	async sendVerificationEmail(email: string): Promise<void> {
		const verificationToken = this.jwt.sign(
			{ email: email },
			{ expiresIn: '1d' }
		)

		const verificationLink = `http://localhost:3000/me/confirm-email/verify-email?token=${verificationToken}`

		const mailData: IVerificationMailContext = {
			link: verificationLink,
		}

		await this.mailService.sendMail<IVerificationMailContext>({
			to: email,
			subject: 'Подтвердите свой email',
			template: MailTemplates.verification,
			context: mailData,
		})
	}

	async verifyEmail(dto: verifyEmailDto): Promise<boolean> {
		try {
			const { token } = dto
			const decodedToken = this.jwt.verify(token)
			const userEmail = decodedToken.email

			const user = await this.prisma.user.findUnique({
				where: { email: userEmail },
			})

			if (!user) {
				return false
			}

			user.emailConfirm = true
			await this.prisma.user.update({
				where: { id: user.id },
				data: {
					emailConfirm: true,
				},
			})
		} catch (error) {
			return false
		}
	}

	async resetPassword(dto: ResetPasswordDto) {
		try {
			const { email } = dto
			const user = await this.prisma.user.findUnique({
				where: { email },
			})

			if (!user) throw new NotFoundException(`Пользователь не найден`)

			const newPassword = generatePassword()

			const updateUser = await this.prisma.user.update({
				where: { id: user.id },
				data: {
					password: await hash(newPassword),
				},
			})

			if (!updateUser) throw new NotFoundException(`Finish with an error 1`)

			await this.mailService.sendMail<IResetPasswordMailContext>({
				to: user.email,
				subject: 'Новые данные для входа на TodayProduct',
				template: MailTemplates.resetPassword,
				context: {
					email: user.email,
					newPassword: newPassword,
					link: `https://google.com/`,
				},
			})
		} catch (e) {
			throw new BadRequestException('Finish with an error 2' + e)
		}
	}
}
