import { Injectable } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import { ParserService } from 'src/parser/parser.service'
import { TelegramService } from 'src/telegram/telegram.service'

@Injectable()
export class CronService {
	constructor(
		private parserService: ParserService,
		private telegramService: TelegramService
	) {}

	@Cron('32 23 * * *')
	async parseAllProductAtMidnight() {
		try {
			this.telegramService.sendMessageToAdmins(
				'Parsing for all products is RUNNING🔥'
			)
			await this.parserService.parsePriceForAll()
			console.log('Parsing success!')
			this.telegramService.sendMessageToAdmins(
				'Parsing for all products is SUCCESS✅'
			)
		} catch (e) {
			console.log('Parsing finish was with an error', e)
			this.telegramService.sendMessageToAdmins(
				`Parsing finish was with an ERROR😏 \n Error message: ${e}`
			)
		}
	}
}
