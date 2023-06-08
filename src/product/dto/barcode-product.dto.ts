import { IsNumber, IsString } from 'class-validator'

export class barcodeProductDto {
	@IsNumber()
	productId: number

	@IsString()
	code: string
}
