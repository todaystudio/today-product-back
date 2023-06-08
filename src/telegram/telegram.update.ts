import {
	Ctx,
	Hears,
	InjectBot,
	Message,
	On,
	Start,
	Update,
} from 'nestjs-telegraf'
import { Telegraf } from 'telegraf'
import { Context } from './context.interface'
import { TelegramService } from './telegram.service'

@Update()
export class TelegramUpdate {
	constructor(
		@InjectBot() private readonly bot: Telegraf<Context>,
		private readonly telegramService: TelegramService
	) {}

	@Start()
	async startCommand(@Ctx() ctx: Context, @Message('text') msg: string) {
		if (msg.includes('token-')) {
			const token = msg.split('token-')[1]
			console.log(23, token)
			const service = await this.telegramService.connectUser(ctx, +token)
			return
		}
		await ctx.reply(
			`Hi! This bot is still in development. We'd love to see you later. ${msg}`
		)
	}

	@Hears('/unsubscribe')
	async unsubscribe(@Ctx() ctx: Context) {
		const loading = ctx.reply('Минуточку...⏳')
		await this.telegramService.unsubscribe(ctx)
		ctx.deleteMessage((await loading).message_id)
	}

	@On('text')
	async checkToken(@Ctx() ctx: Context, @Message('text') msg: any) {
		console.log(msg, 99)
	}
}
