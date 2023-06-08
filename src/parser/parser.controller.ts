import { Controller, Get, Param } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ParserService } from './parser.service'

@Controller('parser')
@ApiTags('Parser')
export class ParserController {
	constructor(private readonly parserService: ParserService) {}
	@Get('go/:id')
	async goParserById(@Param('id') id: string) {
		return await this.parserService.goParserById(+id)
	}

	@Get('go-all')
	async parsePriceForAll() {
		return await this.parserService.parsePriceForAll()
	}

	@Get('parse-from-shops')
	async parseProductsFromShops() {
		return await this.parserService.parseProductsFromShops()
	}
}
