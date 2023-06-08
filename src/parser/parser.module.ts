import { Module } from '@nestjs/common'
import { PaginationService } from 'src/pagination/pagination.service'
import { PriceService } from 'src/price/price.service'
import { PrismaService } from 'src/prisma.service'
import { ProductService } from 'src/product/product.service'
import { ParserController } from './parser.controller'
import { ParserService } from './parser.service'

@Module({
	controllers: [ParserController],
	providers: [
		ParserService,
		ProductService,
		PrismaService,
		PaginationService,
		PriceService,
	],
	exports: [ParserService],
})
export class ParserModule {}
