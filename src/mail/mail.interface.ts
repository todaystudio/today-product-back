export enum MailTemplates {
	verification = 'verification',
	news = 'news',
	resetPassword = 'resetPassword',
	default = 'default',
}

export type typeMail =
	| IVerificationMailContext
	| INewsMailContext
	| IResetPasswordMailContext

export interface IVerificationMailContext {
	link: string
	id?: number
}

export interface INewsMailContext {
	text: string
	id: number
}

export interface IResetPasswordMailContext {
	email: string
	newPassword: string
	link: string
}

export interface IMailSendHeaders<T> {
	to: string
	subject?: string
	template?: MailTemplates
	context: T
}
