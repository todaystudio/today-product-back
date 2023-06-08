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
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CreatePriceDto } from './dto/create-price.dto'
import { UpdatePriceDto } from './dto/update-price.dto'
import { PriceService } from './price.service'

@Controller('prices')
@ApiTags('Price')
export class PriceController {
	constructor(private readonly priceService: PriceService) {}

	@UsePipes(new ValidationPipe())
	@Post()
	@HttpCode(200)
	@Auth()
	async create(@Body() createPriceDto: CreatePriceDto) {
		return this.priceService.create(createPriceDto)
	}

	@Get()
	@Auth()
	async findAll() {
		return this.priceService.findAll()
	}

	@Get('by-id/:id')
	@Auth()
	async findOneById(@Param('id') id: string) {
		return this.priceService.findOneById(+id)
	}

	@Get('by-product/:id')
	@Auth()
	async findByProductId(@Param('id') id: string) {
		return this.priceService.findByProductId(+id)
	}

	@UsePipes(new ValidationPipe())
	@Patch(':id')
	@HttpCode(200)
	@Auth()
	async update(
		@Param('id') id: string,
		@Body() updatePriceDto: UpdatePriceDto
	) {
		return this.priceService.update(+id, updatePriceDto)
	}

	@Delete(':id')
	@HttpCode(200)
	@Auth()
	async remove(@Param('id') id: string) {
		return this.priceService.remove(+id)
	}
}
