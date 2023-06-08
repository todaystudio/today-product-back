import { Controller, Get } from '@nestjs/common'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CurrentUser } from 'src/auth/decorators/user.decorator'
import { SubscribeService } from './subscribe.service'

@Controller('subscribe')
export class SubscribeController {
	constructor(private readonly subscribeService: SubscribeService) {}

	@Get('create-link')
	@Auth()
	async subscribe(@CurrentUser('id') id: number) {
		return this.subscribeService.createSubscribeLink(id)
	}

	@Get('unsubscribe')
	@Auth()
	async unsubscribe(@CurrentUser('telegramId') tgId: number) {
		return await this.subscribeService.unsubscribe(+tgId)
	}

	@Get('toggle-mailing')
	@Auth()
	async toggleMailing(@CurrentUser('telegramId') tgId: string) {
		return await this.subscribeService.toggleMailing(+tgId)
	}
}
