import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'

@Injectable()
export class SubscribeService {
	constructor(private prisma: PrismaService) {}

	async checkSubscribe(tgId: number) {
		const user = await this.prisma.subscribers.findUnique({
			where: {
				telegramId: tgId,
			},
			include: {
				user: true,
			},
		})

		if (!user) throw new NotFoundException('Пользователь не найден')

		return user
	}

	async createSubscribeLink(userId: number) {
		try {
			const link = `https://t.me/todayproduct_bot?start=token-${userId}`

			return { link }
		} catch (e) {
			throw new BadRequestException('Failed subscribe', {
				description: e.message,
			})
		}
	}

	async connectUser(userId: number, tgId: number) {
		try {
			const oldUser = await this.prisma.subscribers.findUnique({
				where: {
					userId,
				},
			})
			if (oldUser) throw new Error('Пользователь уже существует')
			const user = await this.prisma.subscribers.create({
				data: {
					user: {
						connect: {
							id: userId,
						},
					},
					telegramId: tgId,
				},
			})
			const updatedUser = await this.prisma.user.update({
				where: { id: userId },
				data: { telegramId: String(tgId) },
			})
			return user
		} catch (e) {
			throw new Error('Connecting finish was failed')
		}
	}

	async unsubscribe(tgId: number) {
		try {
			const userSubs = await this.prisma.subscribers.delete({
				where: { telegramId: tgId },
			})
			const updateUser = await this.prisma.user.update({
				where: {
					telegramId: String(tgId),
				},
				data: {
					telegramId: null,
				},
			})
		} catch {
			throw new Error('Отписаться не получилось')
		}
	}

	async toggleMailing(tgId: number) {
		console.log(tgId)
		try {
			const subscribe = await this.prisma.subscribers.findUnique({
				where: { telegramId: tgId },
			})
			const userSubs = await this.prisma.subscribers.update({
				where: { telegramId: tgId },
				data: {
					mailing: !subscribe.mailing,
				},
			})

			return userSubs
		} catch (e) {
			console.log(e)
			throw new BadRequestException(
				'Toggle Telegram mailing finish with an Error'
			)
		}
	}
}
