import { Markup } from 'telegraf'

export function mainMenuBeforeAuth() {
	return Markup.inlineKeyboard([
		Markup.button.callback('Подписаться на рассылку 🔥', 'toSubscribe'),
	])
}

export function mainMenu() {
	return Markup.inlineKeyboard(
		[
			Markup.button.callback('📈 Товар с самым большим ростом', 'theMostUp'),
			Markup.button.callback('🆕 Добавить товар', 'addProducts'),
			Markup.button.callback('🔍 Найти товар', 'searchProduct'),
		],
		{
			columns: 2,
		}
	)
}
