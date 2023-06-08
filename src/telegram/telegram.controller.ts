import { Controller, Get } from '@nestjs/common'
import { TelegramService } from './telegram.service'
import { ApiTags } from '@nestjs/swagger'

@Controller('telegram')
@ApiTags('Telegram')
export class TelegramController {
	constructor(private readonly telegramService: TelegramService) {}
	@Get()
	async sendMessage() {
		return await this.telegramService.sendMessageToAdmins('4567890')
	}
}
