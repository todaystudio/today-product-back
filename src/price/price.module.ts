import { Module } from '@nestjs/common'
import { PaginationService } from 'src/pagination/pagination.service'
import { ParserService } from 'src/parser/parser.service'
import { PrismaService } from 'src/prisma.service'
import { ProductService } from 'src/product/product.service'
import { PriceController } from './price.controller'
import { PriceService } from './price.service'

@Module({
	controllers: [PriceController],
	providers: [
		PriceService,
		PrismaService,
		ProductService,
		PaginationService,
		ParserService,
	],
	exports: [],
})
export class PriceModule {}
