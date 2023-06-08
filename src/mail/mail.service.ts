import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'
import { IMailSendHeaders, MailTemplates } from './mail.interface'

@Injectable()
export class MailService {
	constructor(private readonly mailerService: MailerService) {}

	async sendMail<T>(data: IMailSendHeaders<T>) {
		await this.mailerService
			.sendMail({
				to: data.to,
				subject: data.subject || 'New email from Today Product',
				template: String(data.template) || 'default',
				context: {
					...data.context,
				},
			})
			.then(() => {
				console.log('success')
			})
			.catch((e) => {
				console.log('error', e)
			})
	}
}
