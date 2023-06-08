import { IsNumber, IsOptional } from 'class-validator'

export class CreatePriceDto {
	@IsNumber()
	price: number

	@IsNumber()
	@IsOptional()
	shopId?: number

	@IsNumber()
	productId: number
}
