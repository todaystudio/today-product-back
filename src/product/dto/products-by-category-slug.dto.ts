import { IsString } from 'class-validator'
import { PaginationDto } from 'src/pagination/dto/pagination.dto'

export class ProductsByCategorySlugDto extends PaginationDto {
	@IsString()
	slug: string
}
