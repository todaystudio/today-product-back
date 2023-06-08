import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Patch,
	Post,
	Query,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Prisma, User } from '@prisma/client'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CurrentUser } from 'src/auth/decorators/user.decorator'
import { PaginationDto } from 'src/pagination/dto/pagination.dto'
import { addParseUrlDto } from './dto/add-parse-url.dto'
import { barcodeProductDto } from './dto/barcode-product.dto'
import { CreateProductDto } from './dto/create-product.dto'
import { GetAllProductDto } from './dto/get-all-product.dto'
import { ProductService } from './product.service'

@Controller('products')
@ApiTags('Products')
export class ProductController {
	constructor(private readonly productService: ProductService) {}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('create')
	@Auth()
	async create(
		@Body() createProductDto: CreateProductDto,
		@CurrentUser() user: User
	) {
		return this.productService.create(createProductDto, user)
	}

	@UsePipes(new ValidationPipe())
	@Get()
	async findAll(@Query() queryDto: GetAllProductDto) {
		return this.productService.findAll(queryDto)
	}

	@Get('by-id/:id')
	@Auth()
	async findOneById(@Param('id') id: string) {
		return this.productService.findOneById(+id)
	}

	@Get('barcode/:id')
	async getBarcodesByProduct(@Param('id') id: string) {
		return await this.productService.getBarcodesByProduct(+id)
	}

	@UsePipes(new ValidationPipe())
	@Post('barcode')
	async addBarcode(@Body() dto: barcodeProductDto) {
		return await this.productService.addBarcode(dto)
	}

	@Delete('barcode')
	async deleteBarcode(@Body() dto: barcodeProductDto) {
		return await this.productService.deleteBarcode(dto)
	}

	@Get('by-slug/:slug')
	async findOneBySlug(@Param('slug') slug: string) {
		return this.productService.findOneBySlug(slug)
	}

	@Get('/similar/:id')
	async getSimilarProducts(@Param('id') id: string) {
		return this.productService.getSimilarProducts(+id)
	}

	@Get('by-category/:slug')
	async findByCategorySlug(
		@Param('slug') slug: string,
		@Query() pagination: PaginationDto
	) {
		return this.productService.findByCategorySlug(slug, pagination)
	}

	@Get('by-barcode/:code')
	async getProductByBarcode(@Param('code') code: string) {
		return await this.productService.getProductByBarcode(code)
	}

	@Get('most-dynamic')
	async getMostDynamic(@Query() dto: PaginationDto) {
		return await this.productService.getMostDynamic(dto)
	}

	@Post('parse-url')
	async addParseUrl(@Body() dto: addParseUrlDto) {
		return await this.productService.addParseUrl(dto)
	}

	@Delete('parse-url')
	async deleteParseUrl(@Body() dto: addParseUrlDto) {
		return await this.productService.deleteParseUrl(dto)
	}

	@Get('price-history/:id')
	async getPriceHistory(@Param('id') id: string) {
		return await this.productService.getPriceHistory(+id)
	}

	@UsePipes(new ValidationPipe())
	@Patch(':id')
	@HttpCode(200)
	@Auth()
	async update(
		@Param('id') id: string,
		@Body() updateProductDto: Prisma.ProductUpdateInput
	) {
		return this.productService.update(+id, updateProductDto)
	}

	@Delete(':id')
	@HttpCode(200)
	@Auth()
	async delete(@Param('id') id: string) {
		return this.productService.remove(+id)
	}

	@Get('by-shop/:slug')
	async getByShop(@Param('slug') slug: string) {
		return this.productService.getByShop(slug)
	}

	@Get('price-params/:id')
	async getPriceParams(@Param('id') id: string) {
		return this.productService.getPriceParams(+id)
	}
}
