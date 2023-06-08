import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Patch,
	Post,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Prisma } from '@prisma/client'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { ShopService } from './shop.service'
import { GetManyByIdDto } from './dto/create-shop.dto'

@Controller('shop')
@ApiTags('Shop')
export class ShopController {
	constructor(private readonly shopService: ShopService) {}

	@UsePipes(new ValidationPipe())
	@Post()
	@HttpCode(200)
	@Auth()
	async create(@Body() dto: Prisma.ShopCreateInput) {
		return this.shopService.create(dto)
	}

	@Get()
	async findAll() {
		return this.shopService.findAll()
	}

	@Get('by-id/:id')
	async findOneById(@Param('id') id: string) {
		return this.shopService.findOneById(+id)
	}

	@Get('by-slug/:slug')
	async findOneBySlug(@Param('slug') slug: string) {
		return this.shopService.findOneBySlug(slug)
	}

	@UsePipes(new ValidationPipe())
	@Get('/many-by-id')
	async findManyById(@Body() dto: GetManyByIdDto) {
		return await this.shopService.findManyById(dto)
	}

	@UsePipes(new ValidationPipe())
	@Patch(':id')
	@HttpCode(200)
	@Auth()
	async update(@Param('id') id: string, @Body() dto: Prisma.ShopUpdateInput) {
		return this.shopService.update(+id, dto)
	}

	@Delete(':id')
	@Auth()
	async remove(@Param('id') id: string) {
		return this.shopService.remove(+id)
	}
}
