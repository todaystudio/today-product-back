import { Module } from '@nestjs/common'
import { PaginationService } from 'src/pagination/pagination.service'
import { PrismaService } from 'src/prisma.service'
import { ProductService } from 'src/product/product.service'
import { CategoryController } from './category.controller'
import { CategoryService } from './category.service'

@Module({
	controllers: [CategoryController],
	providers: [
		CategoryService,
		PrismaService,
		ProductService,
		PaginationService,
	],
	exports: [CategoryService],
})
export class CategoryModule {}
