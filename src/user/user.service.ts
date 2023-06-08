import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common'
import { hash } from 'argon2'
import {
	IResetPasswordMailContext,
	MailTemplates,
} from 'src/mail/mail.interface'
import { MailService } from 'src/mail/mail.service'
import { PrismaService } from 'src/prisma.service'
import { UpdateUserDto } from './dto/user.dto'

@Injectable()
export class UserService {
	constructor(
		private prisma: PrismaService,
		private mailService: MailService // private authService: AuthService
	) {}

	async getById(id: number) {
		const user = await this.prisma.user.findFirst({
			where: { id },
			include: {
				OrderForUpdatePrice: true,
				productSubs: true,
				Subscribers: true,
			},
		})

		if (!user) throw new BadRequestException('User not found')

		return user
	}

	async resetPassword(id: number) {
		const user = await this.prisma.user.findFirst({
			where: { id },
		})

		if (!user) throw new BadRequestException('User not found')

		const newPassword = Math.random().toString(36).slice(-8)

		const updatedUser = await this.prisma.user.update({
			where: {
				id: user.id,
			},
			data: {
				password: await hash(newPassword),
			},
		})

		if (!updatedUser) throw new BadRequestException('Password change failed')

		await this.mailService.sendMail<IResetPasswordMailContext>({
			context: {
				email: user.email,
				link: 'http://localhost:3000/auth/login',
				newPassword: newPassword,
			},
			to: user.email,
			subject: 'TodayProduct – новые данные для входа',
			template: MailTemplates.resetPassword,
		})

		return updatedUser
	}

	async getByEmail(email: string) {
		const user = await this.prisma.user.findFirst({
			where: {
				email: email,
			},
			include: {
				OrderForUpdatePrice: true,
				productSubs: true,
				Subscribers: true,
			},
		})

		if (!user) throw new BadRequestException('User not found')

		return user
	}

	async getTelegramIdOfAdmin(): Promise<number[]> {
		const ids = await this.prisma.user.findMany({
			where: {
				isAdmin: true,
				NOT: {
					telegramId: null,
				},
			},
			select: {
				telegramId: true,
			},
		})

		if (!ids) throw new NotFoundException('Админы не добавили свою телегу')
		const arrIds = ids.map((id) => +id.telegramId)
		return arrIds
	}

	async changePassword(password: string, id: number) {
		try {
			const user = await this.prisma.user.update({
				where: { id },
				data: {
					password: await hash(password),
				},
			})

			return user
		} catch (e) {
			throw new BadRequestException(
				'Changing password was finish with an error'
			)
		}
	}

	async update(dto: UpdateUserDto, id: number) {
		try {
			const user = await this.prisma.user.update({
				where: { id },
				data: { ...dto },
			})
			return user
		} catch (e) {
			throw new BadRequestException(e, 'Updating user was finish with an error')
		}
	}
}
