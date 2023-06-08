import { Controller } from '@nestjs/common'
import { IsArray } from 'class-validator'
import { AppService } from './app.service'

export class urlsDto {
	@IsArray()
	urls: string[]
}

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}
}
