import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { Auth } from 'src/auth/decorators/auth.decorator'
import {
	ByProductAndUserDto,
	CreateOrderForUpdatePriceDto,
	OFUPByEmailDto,
} from './dto/order-for-update-price.dto'
import { OrderForUpdatePriceService } from './order-for-update-price.service'
import { CurrentUser } from 'src/auth/decorators/user.decorator'

@Controller('order-for-update-price')
export class OrderForUpdatePriceController {
	constructor(
		private readonly orderForUpdatePriceService: OrderForUpdatePriceService
	) {}

	@UsePipes(new ValidationPipe())
	@Post()
	create(@Body() dto: CreateOrderForUpdatePriceDto) {
		return this.orderForUpdatePriceService.create(dto)
	}

	@UsePipes(new ValidationPipe())
	@Get()
	findAll() {
		return this.orderForUpdatePriceService.findAll()
	}

	@UsePipes(new ValidationPipe())
	@Get('get-one/:id')
	findOne(@Param('id') id: string) {
		return this.orderForUpdatePriceService.findOne(+id)
	}

	@UsePipes(new ValidationPipe())
	@Patch(':id')
	update(
		@Param('id') id: string,
		@Body() dto: Prisma.OrderForUpdatePriceUpdateInput
	) {
		return this.orderForUpdatePriceService.update(+id, dto)
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.orderForUpdatePriceService.remove(+id)
	}

	@UsePipes(new ValidationPipe())
	@Post('/by-user-product')
	@Auth()
	async getByProductAndUser(@Body() dto: ByProductAndUserDto) {
		return await this.orderForUpdatePriceService.getByProductAndUser(dto)
	}

	@UsePipes(new ValidationPipe())
	@Post('/by-email')
	@Auth()
	async getByUserEmail(@Body() dto: OFUPByEmailDto) {
		return await this.orderForUpdatePriceService.getByUserEmail(dto)
	}

	@UsePipes(new ValidationPipe())
	@Get('/by-user')
	@Auth()
	async getByUser(@CurrentUser('id') id: number) {
		return await this.orderForUpdatePriceService.getByUser(id)
	}
}
