import { Injectable } from '@nestjs/common'
import { urlsDto } from './app.controller'
import { ParserService } from './parser/parser.service'

@Injectable()
export class AppService {
	constructor(private parser: ParserService) {}
}
