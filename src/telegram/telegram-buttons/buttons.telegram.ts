import { Context, Markup } from 'telegraf'

export const urlButton = (
	url: string,
	text: string = '🔍 Посмотреть на сайте'
) => {
	return Markup.inlineKeyboard([Markup.button.url(text, url)])
}

export const connectButtonMarkup = async (ctx: Context, res: boolean) => {
	if (res) {
		await ctx.reply(
			'Отлично!\n\nМы присоединили твой Телеграм к аккаунту на сайте. Ниже ссылка, чтобы вернуться на сайт.',
			{
				reply_markup: {
					inline_keyboard: [
						[
							{
								text: 'Вернуться в личный кабинет',
								url: 'https://google.com/',
							},
						],
					],
				},
			}
		)
	} else {
		await ctx.reply(
			`К сожалению, произошла какая-то ошибка 🤷🏻‍♂️.\n\nВероятно, твой Телеграм уже подключен к аккаунту на сайте.`,
			{
				reply_markup: {
					inline_keyboard: [
						[
							{
								text: 'Вернуться в личный кабинет',
								url: 'https://google.com/',
							},
						],
					],
				},
			}
		)
	}
}
