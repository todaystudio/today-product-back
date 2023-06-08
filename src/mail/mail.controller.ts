import { Controller, Get } from '@nestjs/common'
import { IVerificationMailContext, MailTemplates } from './mail.interface'
import { MailService } from './mail.service'

@Controller('mail')
export class MailController {
	constructor(private readonly mailService: MailService) {}

	@Get()
	async sendMail() {
		return await this.mailService.sendMail<IVerificationMailContext>({
			context: { id: 123, link: 'https://google.com/' },
			to: 'todaystudiooo@gmail.com',
			subject: 'Подтверждение email на сайте TodayProducts',
			template: MailTemplates.verification,
		})
	}
}
