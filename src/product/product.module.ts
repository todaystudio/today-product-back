import { Module } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { CategoryService } from 'src/category/category.service'
import { PaginationService } from 'src/pagination/pagination.service'
import { PrismaService } from 'src/prisma.service'
import { ProductController } from './product.controller'
import { ProductService } from './product.service'

@Module({
	controllers: [ProductController],
	providers: [
		ProductService,
		PrismaService,
		JwtService,
		PaginationService,
		CategoryService,
	],
	exports: [ProductService],
})
export class ProductModule {}
