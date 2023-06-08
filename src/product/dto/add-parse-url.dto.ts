import { IsNumber, IsString } from 'class-validator'

export class addParseUrlDto {
	@IsString()
	url: string

	@IsNumber()
	id: number
}
