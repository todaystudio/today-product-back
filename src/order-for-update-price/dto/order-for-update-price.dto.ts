import { IsEmail, IsNumber, IsOptional, IsString, Min } from 'class-validator'

export class CreateOrderForUpdatePriceDto {
	@IsNumber()
	@Min(1, { message: 'Цена не может быть меньше нуля' })
	price: number

	@IsEmail()
	userEmail: string

	@IsNumber()
	productId: number

	@IsOptional()
	@IsString()
	link?: string

	@IsOptional()
	@IsString()
	message?: string
}

export class ByProductAndUserDto {
	@IsString()
	userEmail: string

	@IsNumber()
	productId: number
}

export class OFUPByEmailDto {
	@IsEmail()
	email: string
}
