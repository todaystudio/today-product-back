import { BadRequestException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectBot } from 'nestjs-telegraf'
import { SubscribeService } from 'src/subscribe/subscribe.service'
import { UserService } from 'src/user/user.service'
import { Context, Telegraf } from 'telegraf'
import { connectButtonMarkup } from './telegram-buttons/buttons.telegram'

@Injectable()
export class TelegramService {
	constructor(
		private readonly configService: ConfigService,
		private readonly userService: UserService,
		private readonly subscribeService: SubscribeService,
		@InjectBot() private readonly bot: Telegraf<Context>
	) {}

	async sendMessage(message: string, toUser: number) {
		try {
			const res = await this.bot.telegram.sendMessage(toUser, message)
			return res
		} catch (e) {
			throw new BadRequestException(e.message)
		}
	}

	async sendMessageToAdmins(message: string) {
		const users = await this.userService.getTelegramIdOfAdmin()
		for (const id of users) {
			await this.sendMessage(message, id)
		}
	}

	async connectUser(ctx: Context, token: number) {
		try {
			const tgId = ctx.from.id
			const connected = await this.subscribeService.connectUser(token, tgId)
			if (connected) await connectButtonMarkup(ctx, true)
			else await connectButtonMarkup(ctx, false)
		} catch (e) {
			await connectButtonMarkup(ctx, false)
		}
	}

	async unsubscribe(ctx: Context) {
		try {
			const tgId = ctx.message.from.id
			await this.subscribeService.unsubscribe(tgId)
			await this.sendMessage('Успешно отписались 👍🏻', ctx.message.from.id)
		} catch (e) {
			await this.sendMessage(e, ctx.message.from.id)
		}
	}

	getToken(): string {
		return this.configService.get<string>('TG_TOKEN')
	}
}
