import { IsNumber, IsOptional, IsString } from 'class-validator'

export class CreateProductDto {
	@IsString()
	title: string

	@IsOptional()
	@IsString()
	description: string

	@IsNumber()
	categoryId: number

	@IsNumber()
	weight: number

	@IsOptional()
	@IsString()
	imagePath: string

	@IsOptional()
	@IsString()
	Barcode: string

	@IsOptional()
	@IsString()
	parseUrl: string[]
}
