import { IsString } from 'class-validator'

export class verifyEmailDto {
	@IsString()
	token: string
}
